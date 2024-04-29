export default interface IStock {
    id: string;
    warehouse: string;
    product: object;
    quantity: number;
    blocked: number;
    reserved: number;
    createdAt: Date;
    updatedAt: Date | undefined;
}
