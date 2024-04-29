import dynamoDBClient from '../model';
import MovementService from './movementService';
import StockService from './stockService';

export const stockService = new StockService(dynamoDBClient);
export const movementService = new MovementService(dynamoDBClient);
