import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Patch } from '../index';
import { expect, describe, it } from '@jest/globals';
import updateEvent from '../../events/update.json';
import updateErrEvent from '../../events/updateErr.json';
import updateErr2Event from '../../events/updateErr2.json';

describe('Product update tests', () => {
    it('Should return error required id', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateErr2Event));

        const result: APIGatewayProxyResult = await Patch(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body.message).toEqual('Required ID');
    });
    it('Should return error product not found', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateErrEvent));

        const result: APIGatewayProxyResult = await Patch(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Product not found');
    });
    it('Should return product with new description', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateEvent));

        const result: APIGatewayProxyResult = await Patch(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.product.description).toEqual('PRDUPDATED');
    });
});
