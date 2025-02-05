import { config } from 'dotenv';
config({ path: 'D:/javasript/drug sys/backend/.env' });

import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

const addItemToDynamoDB = async () => {
  const params = {
    TableName: "inventory", // Ensure this is the correct table name
    Item: {
      productId: { S: "12345" }, // String value for productId
      name: { S: "Aspirin" }, // Name of the product
      stock: { N: "50" }, // Quantity of stock
      price: { N: "5.99" }, // Price per unit
      instituteEmail: { S: "pharmacy@institution.com" } // Email of the institution
    }
  };

  try {
    // Creating the PutItemCommand with the parameters
    const command = new PutItemCommand(params);

    // Sending the command to DynamoDB
    const data = await client.send(command);

    // Success message after adding the item
    console.log("Item added successfully:", data);
  } catch (error) {
    console.error("Error adding item to DynamoDB:", error);
  }
};
const getItemFromDynamoDB = async (productId) => {
    const params = {
      TableName: "inventory", // The name of your table
      Key: {
        productId: { S: productId } // The key (assuming productId is a string)
      }
    };
  
    try {
      // Creating the GetItemCommand with the parameters
      const command = new GetItemCommand(params);
  
      // Sending the command to DynamoDB
      const data = await client.send(command);
  
      if (!data.Item) {
        console.log("Item not found");
      } else {
        console.log("Item retrieved successfully:", data.Item);
      }
    } catch (error) {
      console.error("Error reading item from DynamoDB:", error);
    }
  };
  
  // Usage example with a productId of '12345'
  
//   addItemToDynamoDB();
  getItemFromDynamoDB('12345');
