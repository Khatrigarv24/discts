import { ddbDocClient } from './inventory-services';
import { Context } from 'hono';
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';

// 📌 Type Definition for Inventory Item
interface InventoryItem {
  productId: string;
  name: string;
  stock: number;
  price: number;
}

// 📌 Add an Item
export const addItem = async (c: Context) => {
  const { name, stock, price }: Omit<InventoryItem, 'productId'> = await c.req.json();
  if (!name || stock === undefined || price === undefined) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const productId = `prod-${Date.now()}`; // Unique ID generation

  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: 'discts',
        Item: { productId, name, stock, price },
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
  const { stock }: { stock: number } = await c.req.json();

  if (stock === undefined) return c.json({ error: "Stock value is required" }, 400);

  try {
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: 'discts',
        Key: { productId },
        UpdateExpression: "SET stock = :stock",
        ExpressionAttributeValues: { ":stock": stock },
      })
    );

    return c.json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    return c.json({ error: "Error updating stock", details: error.message }, 500);
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
