import { DynamoDB } from 'aws-sdk';
const dynamoDBClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });

export default dynamoDBClient;
