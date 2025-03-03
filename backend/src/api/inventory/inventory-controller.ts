import { ddbDocClient } from './inventory-services';
import { Context } from 'hono';
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

// 📌 Type Definition for Inventory Item
interface InventoryItem {
  productId: string;
  name: string;
  stock: number;
  price: number;
  batchNumber: string;
  manufacturingDate: string; // ISO date string format
  expiryDate: string; // ISO date string format
}

// 📌 Add an Item
export const addItem = async (c: Context) => {
  const { name, stock, price, batchNumber, manufacturingDate, expiryDate }: Omit<InventoryItem, 'productId'> = await c.req.json();
  if (!name || stock === undefined || price === undefined || !batchNumber || !manufacturingDate || !expiryDate) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  // Validate dates
  const mfgDate = new Date(manufacturingDate);
  const expDate = new Date(expiryDate);
  
  if (isNaN(mfgDate.getTime())) {
    return c.json({ error: "Invalid manufacturing date format" }, 400);
  }
  
  if (isNaN(expDate.getTime())) {
    return c.json({ error: "Invalid expiry date format" }, 400);
  }
  
  if (mfgDate > expDate) {
    return c.json({ error: "Manufacturing date cannot be after expiry date" }, 400);
  }

  // Keep using your existing ID generation method
  const productId = `prod-${Date.now()}`;

  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: 'discts',
        Item: { 
          productId, 
          name, 
          stock, 
          price, 
          batchNumber, 
          manufacturingDate,
          expiryDate 
        },
      })
    );

    return c.json({ message: "Item added successfully", productId }, 201);
  } catch (error) {
    console.error("❌ Error adding item:", error);
    return c.json({ error: "Error adding item", details: error.message }, 500);
  }
};

// 📌 Get an Item by ID
export const getProductById = async (c: Context) => {
  const productId: string = c.req.param("id");

  try {
    const result = await ddbDocClient.send(
      new GetCommand({ TableName: 'discts', Key: { productId } })
    );

    if (!result.Item) return c.json({ message: "Item not found" }, 404);
    return c.json(result.Item);
  } catch (error) {
    console.error("❌ Error fetching item:", error);
    return c.json({ error: "Error retrieving item", details: error.message }, 500);
  }
};

// 📌 Update Stock
export const updateStock = async (c: Context) => {
  const productId: string = c.req.param("id");
  const { stock, batchNumber, manufacturingDate, expiryDate }: Partial<InventoryItem> = await c.req.json();

  if (stock === undefined && !batchNumber && !manufacturingDate && !expiryDate) {
    return c.json({ error: "At least one update field is required" }, 400);
  }

  try {
    // Build dynamic update expression based on what fields are provided
    let updateExpression = "SET";
    const expressionAttributeValues = {};

    if (stock !== undefined) {
      updateExpression += " stock = :stock";
      expressionAttributeValues[":stock"] = stock;
    }

    if (batchNumber) {
      updateExpression += stock !== undefined ? ", batchNumber = :batchNumber" : " batchNumber = :batchNumber";
      expressionAttributeValues[":batchNumber"] = batchNumber;
    }
    
    if (manufacturingDate) {
      const hasComma = stock !== undefined || batchNumber ? ", " : " ";
      updateExpression += `${hasComma}manufacturingDate = :manufacturingDate`;
      expressionAttributeValues[":manufacturingDate"] = manufacturingDate;
    }

    if (expiryDate) {
      const hasComma = stock !== undefined || batchNumber || manufacturingDate ? ", " : " ";
      updateExpression += `${hasComma}expiryDate = :expiryDate`;
      expressionAttributeValues[":expiryDate"] = expiryDate;
    }

    await ddbDocClient.send(
      new UpdateCommand({
        TableName: 'discts',
        Key: { productId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return c.json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    return c.json({ error: "Error updating item", details: error.message }, 500);
  }
};

// 📌 Delete an Item
export const deleteItem = async (c: Context) => {
  const productId: string = c.req.param("id");

  try {
    await ddbDocClient.send(
      new DeleteCommand({ TableName: 'discts', Key: { productId } })
    );

    return c.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return c.json({ error: "Error deleting item", details: error.message }, 500);
  }
};

export const getAllItems = async (c: Context) => {
  try {
    console.log("Fetching all items from discts table");
    const { Items } = await ddbDocClient.send(
      new ScanCommand({ 
        TableName: 'discts' 
      })
    );

    console.log("Items retrieved:", Items ? Items.length : 0);
    return c.json({ success: true, items: Items || [] });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    return c.json({ success: false, error: "Error retrieving items", details: error.message }, 500);
  }
};

// Modified getSoonToExpire to include manufacturing date in the response
export const getSoonToExpire = async (c: Context) => {
  try {
    const { Items } = await ddbDocClient.send(
      new ScanCommand({ 
        TableName: 'discts' 
      })
    );

    if (!Items) return c.json({ success: true, items: [] });

    // Filter items expiring in the next 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const soonToExpire = Items.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate > today && expiryDate <= thirtyDaysFromNow;
    });

    return c.json({ success: true, items: soonToExpire });
  } catch (error) {
    console.error("❌ Error fetching soon to expire items:", error);
    return c.json({ success: false, error: "Error retrieving soon to expire items", details: error.message }, 500);
  }
};
