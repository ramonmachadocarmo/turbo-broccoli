import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ConfirmPO } from '../index';
import { expect, describe, it } from '@jest/globals';
import confirmEvent from '../../events/confirm.json';

describe('Purchase Order specific tests', () => {
    it('Should confirm Order status & should save stock', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(confirmEvent));

        const result: APIGatewayProxyResult = await ConfirmPO(event);

        expect(result.statusCode).toEqual(200);
    });
});
