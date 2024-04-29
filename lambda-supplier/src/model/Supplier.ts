export default interface ISupplier {
    id: string;
    cnpj: string;
    name: string;
    fantasyName: string;
    createdAt: Date;
    updatedAt: Date | undefined;
}
