import { Operation } from "../../domain";

export class OperationRepositoryMock {
    insert = async (_: any): Promise<Operation> => {
        throw new Error('Not implemented');
    };

    findByExternalId = async (
        _: string
    ): Promise<Operation | null> => {
        return null;
    };

    updateStatus = async (
        _: string,
        __: any
    ): Promise<Operation> => {
        throw new Error('Not implemented');
    };
}
