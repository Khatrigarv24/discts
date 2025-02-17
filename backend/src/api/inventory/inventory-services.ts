import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.AWS_REGION);
console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.AWS_SESSION_TOKEN);
// Create DynamoDB Client
const dbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN
    },
  });

const ddbDocClient = DynamoDBDocumentClient.from(dbClient);

// Function to Ensure Table Exists
export async function connectDB(): Promise<void> {
  try {
    // Check if table already exists
    const listTables = await dbClient.send(new ListTablesCommand({}));
    if (listTables.TableNames?.includes('discts')) {
      console.log("✅ Inventory table exists");
      return;
    }

    // Create Table if Not Exists
    await dbClient.send(
      new CreateTableCommand({
        TableName: 'Inventory',
        KeySchema: [{ AttributeName: 'productId', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'productId', AttributeType: 'S' }],
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    console.log("✅ Inventory table created successfully");
  } catch (err) {
    console.error("❌ Error ensuring DynamoDB table:", err);
  }
}

export { ddbDocClient };
