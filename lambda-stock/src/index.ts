import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as handlers from './function/stock/handlers';

export const GetAll = async (): Promise<APIGatewayProxyResult> => {
    return handlers.get();
};

export const Create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.create(event);
};

export const Delete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.deleteStock(event);
};
export const GetById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.getStock(event);
};
export const GetByStockAndProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.getByStockAndProduct(event);
};
export const SetMovement = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.setMovement(event);
};
