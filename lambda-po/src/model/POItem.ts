export default interface IPOItem {
    id: string;
    product: object;
    quantity: number;
    price: number;
    discount: number;
    createdAt: Date;
    updatedAt: Date | undefined;
}
