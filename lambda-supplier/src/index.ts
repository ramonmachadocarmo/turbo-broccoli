import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as handlers from './function/supplier/handlers';

export const GetAll = async (): Promise<APIGatewayProxyResult> => {
    return handlers.get();
};

export const Create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.create(event);
};

export const Patch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.update(event);
};

export const Delete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.deleteById(event);
};
export const GetById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.getById(event);
};
