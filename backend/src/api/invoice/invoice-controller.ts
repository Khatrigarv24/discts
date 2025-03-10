import { Context } from 'hono';
import { ddbDocClient } from '../inventory/inventory-services';
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { generatePDF } from './invoice-services';

// Define interface for invoice items
interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  batchNumber?: string;
  expiryDate?: string;
  subtotal: number;
}

// Define interface for invoice
interface Invoice {
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  total: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
  status: 'paid' | 'unpaid' | 'cancelled';
  paymentMethod?: string;
}

// Create an invoice and reduce inventory stock
export const createInvoice = async (c: Context) => {
  try {
    // Get invoice data from request body
    const { customerId, customerName, customerPhone, customerEmail, customerAddress, items, paymentMethod } = await c.req.json();

    // Validate required fields
    if (!customerName || !items || !items.length) {
      return c.json({ 
        success: false,
        error: "Missing required fields: customerName and items are required"
      }, 400);
    }

    // Create a new list for processed items
    const processedItems: InvoiceItem[] = [];
    
    // Verify products exist and have enough stock
    for (const item of items) {
      // Check if name or productId is provided
      if ((!item.name && !item.productId) || !item.quantity || item.quantity <= 0) {
        return c.json({ 
          success: false,
          error: `Invalid item: ${JSON.stringify(item)}. Product name or ID and positive quantity required.` 
        }, 400);
      }

      try {
        let product;
        
        // Find product by ID if provided, otherwise search by name
        if (item.productId) {
          const productResponse = await ddbDocClient.send(
            new GetCommand({
              TableName: 'discts',
              Key: { productId: item.productId }
            })
          );
          
          if (!productResponse.Item) {
            return c.json({ 
              success: false,
              error: `Product not found with ID: ${item.productId}` 
            }, 404);
          }
          
          product = productResponse.Item;
        } else if (item.name) {
          // Find product by name using scan (less efficient but more user-friendly)
          const scanResponse = await ddbDocClient.send(
            new ScanCommand({
              TableName: 'discts',
              FilterExpression: 'contains(#name, :name)',
              ExpressionAttributeNames: {
                '#name': 'name',
              },
              ExpressionAttributeValues: {
                ':name': item.name,
              },
            })
          );
          
          if (!scanResponse.Items || scanResponse.Items.length === 0) {
            return c.json({ 
              success: false,
              error: `Product not found with name: ${item.name}` 
            }, 404);
          }
          
          // If multiple products found with similar names, use the first exact match or the first item
          product = scanResponse.Items.find(p => p.name.toLowerCase() === item.name.toLowerCase()) || scanResponse.Items[0];
        }
        
        // Check if there's enough stock
        if (product.stock < item.quantity) {
          return c.json({ 
            success: false,
            error: `Insufficient stock for ${product.name}: Requested ${item.quantity}, Available ${product.stock}` 
          }, 400);
        }

        // Add product info to processed items
        processedItems.push({
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          batchNumber: product.batchNumber,
          expiryDate: product.expiryDate,
          subtotal: item.quantity * product.price
        });
      } catch (error) {
        console.error(`❌ Error fetching product:`, error);
        return c.json({ 
          success: false, 
          error: `Error checking product ${item.name || item.productId}`,
          details: error.message
        }, 500);
      }
    }

    // Calculate totals
    const subtotal = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const taxRate = 0.18; // 18% tax (adjust based on your requirements)
    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    const grandTotal = subtotal + tax;

    // Generate invoice ID with timestamp
    const invoiceId = `inv-${Date.now()}`;
    const createdAt = new Date().toISOString();
    
    // Use a random customerId if not provided
    const finalCustomerId = customerId || `cust-${Date.now()}`;

    // Create complete invoice object
    const invoice: Invoice = {
      invoiceId,
      customerId: finalCustomerId,
      customerName,
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
      customerAddress: customerAddress || null,
      items: processedItems,
      total: subtotal,
      tax,
      grandTotal,
      createdAt,
      status: 'paid',  // Default to paid, adjust as needed
      paymentMethod: paymentMethod || 'cash' // Default to cash
    };

    // Update stock for all products
    for (const item of processedItems) {
      try {
        await ddbDocClient.send(
          new UpdateCommand({
            TableName: 'discts',
            Key: { productId: item.productId },
            UpdateExpression: 'SET stock = stock - :quantity',
            ExpressionAttributeValues: {
              ':quantity': item.quantity
            }
          })
        );
      } catch (error) {
        console.error(`❌ Error updating stock for ${item.productId}:`, error);
        return c.json({ 
          success: false, 
          error: `Failed to update stock for product: ${item.name}`,
          details: error.message
        }, 500);
      }
    }

    // Save the invoice to DynamoDB
    try {
      await ddbDocClient.send(
        new PutCommand({
          TableName: 'invoices',
          Item: invoice
        })
      );

      // Generate PDF
      const pdfBuffer = await generatePDF(invoice);

      // Return success response with invoice details and PDF content as base64
      return c.json({ 
        success: true, 
        message: "Invoice created successfully", 
        invoice: {
          ...invoice,
          pdf: pdfBuffer.toString('base64')
        }
      }, 201);

    } catch (error) {
      console.error(`❌ Error saving invoice:`, error);
      return c.json({
        success: false,
        error: "Failed to save invoice",
        details: error.message
      }, 500);
    }
  } catch (error) {
    console.error("❌ Error processing invoice:", error);
    return c.json({ 
      success: false, 
      error: "Error processing invoice request",
      details: error.message 
    }, 500);
  }
};

// Get all invoices
export const getAllInvoices = async (c: Context) => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: 'invoices'
      })
    );

    return c.json({ 
      success: true, 
      invoices: result.Items || [] 
    });
  } catch (error) {
    console.error("❌ Error fetching all invoices:", error);
    return c.json({ 
      success: false, 
      error: "Error retrieving invoices",
      details: error.message
    }, 500);
  }
};

// Get a specific invoice by ID
export const getInvoiceById = async (c: Context) => {
  const invoiceId = c.req.param('id');
  
  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: 'invoices',
        Key: { invoiceId }
      })
    );

    if (!result.Item) {
      return c.json({ 
        success: false, 
        error: "Invoice not found" 
      }, 404);
    }

    // Generate PDF
    const invoice = result.Item as Invoice;
    const pdfBuffer = await generatePDF(invoice);

    return c.json({ 
      success: true, 
      invoice: {
        ...invoice,
        pdf: pdfBuffer.toString('base64')
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching invoice ${invoiceId}:`, error);
    return c.json({ 
      success: false, 
      error: "Error retrieving invoice",
      details: error.message
    }, 500);
  }
};

// Get invoices by customer ID
export const getInvoicesByCustomer = async (c: Context) => {
  const customerId = c.req.param('customerId');
  
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: 'invoices',
        FilterExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
          ':customerId': customerId
        }
      })
    );

    return c.json({ 
      success: true, 
      invoices: result.Items || [] 
    });
  } catch (error) {
    console.error(`❌ Error fetching invoices for customer ${customerId}:`, error);
    return c.json({ 
      success: false, 
      error: "Error retrieving customer invoices",
      details: error.message
    }, 500);
  }
};

// Download invoice as PDF
export const downloadInvoicePdf = async (c: Context) => {
  const invoiceId = c.req.param('id');
  
  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: 'invoices',
        Key: { invoiceId }
      })
    );

    if (!result.Item) {
      return c.json({ 
        success: false, 
        error: "Invoice not found" 
      }, 404);
    }

    // Generate PDF using the invoice data
    const invoice = result.Item as Invoice;
    const pdfBuffer = await generatePDF(invoice);
    
    // Set appropriate headers for PDF download
    c.header('Content-Type', 'application/pdf');
    c.header('Content-Disposition', `attachment; filename="invoice-${invoiceId}.pdf"`);
    c.header('Content-Length', pdfBuffer.length.toString());
    
    // Return the PDF file directly
    return c.body(pdfBuffer);
  } catch (error) {
    console.error(`❌ Error generating PDF for invoice ${invoiceId}:`, error);
    return c.json({ 
      success: false, 
      error: "Error generating invoice PDF",
      details: error.message
    }, 500);
  }
};

// Delete an invoice by ID
export const deleteInvoice = async (c: Context) => {
  const invoiceId = c.req.param('id');
  try {
    // Delete the invoice from DynamoDB
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: 'invoices',
        Key: { invoiceId }
      })
    );
    console.log(`✅ Deleted invoice ${invoiceId}`);
    return c.json({ 
      success: true, 
      message: `Invoice ${invoiceId} deleted successfully`
    });
  } catch (error) {
    console.error(`❌ Error deleting invoice ${invoiceId}:`, error);
    return c.json({ 
      success: false, 
      error: "Error deleting invoice",
      details: error.message
    }, 500);
  }
};

// Delete invoices older than 60 days
export const deleteOldInvoices = async () => {
  try {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 60)).toISOString();

    // Scan for invoices older than 60 days
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: 'invoices',
        FilterExpression: 'createdAt < :sixtyDaysAgo',
        ExpressionAttributeValues: {
          ':sixtyDaysAgo': sixtyDaysAgo
        }
      })
    );

    const oldInvoices = result.Items || [];

    // Delete each old invoice
    for (const invoice of oldInvoices) {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: 'invoices',
          Key: { invoiceId: invoice.invoiceId }
        })
      );
    }

    console.log(`✅ Deleted ${oldInvoices.length} old invoices`);
  } catch (error) {
    console.error("❌ Error deleting old invoices:", error);
  }
};