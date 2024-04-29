import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Delete } from '../index';
import { expect, describe, it } from '@jest/globals';
import updateErr2Event from '../../events/updateErr2.json';
import getByIdErrEvent from '../../events/getByIdErr.json';
import deleteEvent from '../../events/delete.json';

describe('Product deleted testes', () => {
    it('Should return error required id', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateErr2Event));

        const result: APIGatewayProxyResult = await Delete(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body.message).toEqual('Required ID');
    });
    it('Should return product not found ', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getByIdErrEvent));

        const result: APIGatewayProxyResult = await Delete(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Product not found');
    });
    it('Should delete product', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(deleteEvent));
        const result: APIGatewayProxyResult = await Delete(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.product).toEqual({});
    });
});
