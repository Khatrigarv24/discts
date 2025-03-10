import PDFDocument from 'pdfkit';
import { DynamoDBClient, ListTablesCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

// Create DynamoDB Client (reusing same configuration as inventory)
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    sessionToken: process.env.AWS_SESSION_TOKEN as string,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(dbClient);

// Function to ensure invoice table exists
export async function setupInvoiceTable(): Promise<void> {
  try {
    // Check if table already exists
    const listTables = await dbClient.send(new ListTablesCommand({}));
    
    if (listTables.TableNames?.includes('invoices')) {
      console.log("✅ Invoices table exists");
      return;
    }

    console.log("Creating invoices table...");
    
    // Create the invoices table
    await dbClient.send(
      new CreateTableCommand({
        TableName: 'invoices',
        KeySchema: [{ AttributeName: 'invoiceId', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'invoiceId', AttributeType: 'S' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
    );
    
    console.log("✅ Created invoices table");
  } catch (err) {
    console.error("❌ Error ensuring invoices table:", err);
  }
}

// Define Invoice interface
interface Invoice {
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    batchNumber?: string;
    expiryDate?: string;
    subtotal: number;
  }>;
  total: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
  status: 'paid' | 'unpaid' | 'cancelled';
  paymentMethod?: string;
}

// Function to generate a PDF invoice
export const generatePDF = async (invoice: Invoice): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      // Collect PDF data chunks
      doc.on('data', chunk => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Set up the document
      generateHeader(doc);
      generateCustomerInformation(doc, invoice);
      generateInvoiceTable(doc, invoice);
      generateFooter(doc);

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generate the header section
function generateHeader(doc: PDFKit.PDFDocument): void {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('DISCTS PHARMACY', 50, 45)
    .fontSize(10)
    .text('DISCTS Pharmacy Inc.', 200, 50, { align: 'right' })
    .text('123 Health Street', 200, 65, { align: 'right' })
    .text('City, State 12345', 200, 80, { align: 'right' })
    .moveDown();
}

// Generate customer information section
function generateCustomerInformation(doc: PDFKit.PDFDocument, invoice: Invoice): void {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.invoiceId, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(formatDate(new Date(invoice.createdAt)), 150, customerInformationTop + 15)
    .text('Payment Status:', 50, customerInformationTop + 30)
    .text(invoice.status.toUpperCase(), 150, customerInformationTop + 30)
    .text('Payment Method:', 50, customerInformationTop + 45)
    .text(invoice.paymentMethod || 'Cash', 150, customerInformationTop + 45)
    .text('Balance Due:', 50, customerInformationTop + 60)
    .text(formatCurrency(invoice.status === 'paid' ? 0 : invoice.grandTotal), 150, customerInformationTop + 60)

    .font('Helvetica-Bold')
    .text(invoice.customerName, 300, customerInformationTop)
    .font('Helvetica')
    .text(invoice.customerAddress || '', 300, customerInformationTop + 15)
    .text(
      [
        invoice.customerPhone || '',
        invoice.customerEmail || ''
      ].filter(Boolean).join('\n'), 
      300, customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 287); // Adjusted the position of the horizontal line // Adjusted the position of the horizontal line
}

// Generate the invoice table
function generateInvoiceTable(doc: PDFKit.PDFDocument, invoice: Invoice): void {
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Description',
    'Batch #',
    'Expiry',
    'Unit Cost',
    'Quantity',
    'Line Total'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  let position = invoiceTableTop + 30;
  
  // Add all items from the invoice
  for (let i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    
    // Format the expiry date if available
    const expiryDate = item.expiryDate ? formatDate(new Date(item.expiryDate)) : 'N/A';
    
    generateTableRow(
      doc,
      position,
      (i + 1).toString(),
      item.name,
      item.batchNumber || 'N/A',
      expiryDate,
      formatCurrency(item.price),
      item.quantity.toString(),
      formatCurrency(item.subtotal)
    );

    generateHr(doc, position + 20);
    position += 30;
  }

  // Add summary of totals
  const subtotalPosition = position + 20;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    '',
    '',
    '',
    'Subtotal',
    formatCurrency(invoice.total)
  );

  const taxPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    taxPosition,
    '',
    '',
    '',
    '',
    '',
    'GST (18%)',
    formatCurrency(invoice.tax)
  );

  // Add extra space before Grand Total
  const grandTotalPosition = taxPosition + 40;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    grandTotalPosition,
    '',
    '',
    '',
    '',
    '',
    'Grand Total',
    formatCurrency(invoice.grandTotal)
  );
  doc.font('Helvetica');
}

// Generate a table row in the PDF document
function generateTableRow(
  doc: PDFKit.PDFDocument, 
  y: number, 
  item: string, 
  description: string, 
  batchNumber: string, 
  expiryDate: string, 
  unitCost: string, 
  quantity: string, 
  lineTotal: string
): void {
  doc
    .fontSize(10)
    .text(item, 50, y, { width: 30, align: 'left' })
    .text(description, 80, y, { width: 150, align: 'left' })
    .text(batchNumber, 230, y, { width: 60, align: 'left' })
    .text(expiryDate, 290, y, { width: 60, align: 'left' })
    .text(unitCost, 350, y, { width: 70, align: 'right' })
    .text(quantity, 420, y, { width: 50, align: 'right' })
    .text(lineTotal, 470, y, { width: 70, align: 'right' });
}

// Generate a horizontal line
function generateHr(doc: PDFKit.PDFDocument, y: number): void {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

// Generate the footer
function generateFooter(doc: PDFKit.PDFDocument): void {
  doc
    .fontSize(10)
    .text(
      'Payment is due within 15 days. Thank you for your business.',
      50,
      700,
      { align: 'center', width: 500 }
    )
    .text(
      'DISCTS Pharmacy - Your Health is Our Priority',
      50,
      715,
      { align: 'center', width: 500 }
    );
}

// Format a date as DD/MM/YYYY
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Format a currency value
function formatCurrency(value: number): string {
  return '₹' + Number(value).toFixed(2);
}

// Export the ddbDocClient for use in the controller
export { ddbDocClient };