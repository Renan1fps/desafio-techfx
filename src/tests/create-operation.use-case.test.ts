import test from 'node:test';
import assert from 'node:assert/strict';

import { Operation } from "../domain";
import { OperationRepositoryMock } from "./mocks/operation-dao-mock";
import { CreateOperationUseCase } from "../application/use-case/create-operation.use-case";

import crypto from 'crypto';

const fingerprint = (input: {
    external_id: string;
    amount: number;
    currency: string;
}) =>
    crypto
        .createHash('sha256')
        .update(`${input.external_id}:${input.amount}:${input.currency}`)
        .digest('hex');



const baseOperation: Operation = {
    id: 'uuid-1',
    external_id: 'op-123',
    amount: 100,
    currency: 'BRL',
    payload_fingerprint: 'hash',
    status: 'PROCESSING',
    created_at: new Date(),
    updated_at: new Date(),
    reprocessed_at: null
};

test('should create and process a new operation', async () => {
    const repository = new OperationRepositoryMock();

    repository.insert = async () => ({
        ...baseOperation
    });

    repository.updateStatus = async () => ({
        ...baseOperation,
        status: 'SUCCESS'
    });

    const useCase = new CreateOperationUseCase(
        repository as any
    );

    const result = await useCase.execute({
        external_id: 'op-123',
        amount: 100,
        currency: 'BRL'
    });

    assert.equal(result.status, 'SUCCESS');
    assert.equal(result.external_id, 'op-123');
});

test('should return existing operation when payload is identical', async () => {
    const repository = new OperationRepositoryMock();

    const input = {
        external_id: 'op-123',
        amount: 100,
        currency: 'BRL'
    };

    const hash = fingerprint(input);

    repository.insert = async () => {
        const error: any = new Error('duplicate key');
        error.code = '23505';
        throw error;
    };

    repository.findByExternalId = async () => ({
        ...baseOperation,
        payload_fingerprint: hash,
        status: 'SUCCESS'
    });

    const useCase = new CreateOperationUseCase(
        repository as any
    );

    const result = await useCase.execute(input);

    assert.equal(result.status, 'SUCCESS');
});


test('should throw conflict error when payload differs', async () => {
    const repository = new OperationRepositoryMock();

    repository.insert = async () => {
        const error: any = new Error('duplicate key');
        error.code = '23505';
        throw error;
    };

    repository.findByExternalId = async () => ({
        ...baseOperation,
        payload_fingerprint: 'DIFFERENT_HASH'
    });

    const useCase = new CreateOperationUseCase(
        repository as any
    );

    await assert.rejects(
        async () => {
            await useCase.execute({
                external_id: 'op-123',
                amount: 999,
                currency: 'BRL'
            });
        },
        {
            message: 'Payload conflict for the same external_id'
        }
    );
});

test('should rethrow unexpected errors', async () => {
    const repository = new OperationRepositoryMock();

    repository.insert = async () => {
        throw new Error('database down');
    };

    const useCase = new CreateOperationUseCase(
        repository as any
    );

    await assert.rejects(
        async () => {
            await useCase.execute({
                external_id: 'op-123',
                amount: 100,
                currency: 'BRL'
            });
        },
        {
            message: 'database down'
        }
    );
});
