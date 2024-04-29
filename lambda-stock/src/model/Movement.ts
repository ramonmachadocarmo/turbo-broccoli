import Stock from './Stock';

export default interface IMovement {
    id: string;
    stock: Stock;
    type: string;
    quantity: number;
    movementDate: Date;
    createdAt: Date;
    updatedAt: Date | undefined;
}
