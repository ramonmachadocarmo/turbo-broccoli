export default interface IProduct {
    id: string;
    code: string;
    name: string;
    category: string;
    description: string;
    measureUnit: string;
    measureUnit2?: string;
    stockMin?: number;
    stockMax?: number;
    stockCurrent?: number;
    pricePurchase?: number;
    priceSale?: number;
    createdAt: Date;
    updatedAt: Date | undefined;
}
