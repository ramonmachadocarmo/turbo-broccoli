import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Movement from '../model/Movement';
import Stock from '../model/Stock';
import { stockService } from '.';

export default class MovementService {
    private tableName = 'movementTB';

    constructor(private docClient: DocumentClient) {}

    async setMovement(movement: Movement): Promise<Stock> {
        movement.stock = await stockService.getByWarehouse(movement.stock.warehouse);
        if (movement.type === 'out' && movement.stock.quantity < movement.quantity) {
            throw new Error('Not enough movement.stock');
        }
        if (movement.type == 'out') {
            movement.stock.quantity -= movement.quantity;
        }
        if (movement.type === 'in') {
            movement.stock.quantity += movement.quantity;
        }
        movement.stock = await stockService.updateQty(movement.stock);
        await this.saveMovement(movement);
        return movement.stock;
    }
    async saveMovement(movement: Movement): Promise<Movement> {
        await this.docClient
            .put({
                TableName: this.tableName,
                Item: movement,
            })
            .promise();
        return movement;
    }
}
