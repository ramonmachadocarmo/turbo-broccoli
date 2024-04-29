import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as handlers from './function/po/handlers';

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
export const GetNextCode = async (): Promise<APIGatewayProxyResult> => {
    return handlers.getNextCode();
};
export const ConfirmPO = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return handlers.confirmPO(event);
};
