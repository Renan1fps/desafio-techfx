import { databaseConnection } from './database-connection';
import { Operation, OperationStatus } from '../../domain';
import { OperationRepository } from "../../domain";

export class OperationDao implements OperationRepository {
    async insert(data: {
        external_id: string;
        amount: number;
        currency: string;
        payload_fingerprint: string;
    }): Promise<Operation> {
        const sql = `
            INSERT INTO operations (
                external_id,
                amount,
                currency,
                payload_fingerprint,
                status
            ) VALUES ($1, $2, $3, $4, 'PROCESSING')
                RETURNING *
        `;

        return databaseConnection.one<Operation>(sql, [
            data.external_id,
            data.amount,
            data.currency,
            data.payload_fingerprint
        ]);
    }

    async findByExternalId(
        externalId: string
    ): Promise<Operation | null> {
        const sql = `
            SELECT *
            FROM operations
            WHERE external_id = $1
                LIMIT 1
        `;

        return databaseConnection.oneOrNone<Operation>(sql, [externalId]);
    }

    async updateStatus(
        id: string,
        status: OperationStatus,
        reprocessedAt: Date | null = null
    ): Promise<Operation> {
        const sql = `
            UPDATE operations
            SET status = $2,
                reprocessed_at = $3,
                updated_at = NOW()
            WHERE id = $1
                RETURNING *
        `;

        return databaseConnection.one<Operation>(sql, [
            id,
            status,
            reprocessedAt
        ]);
    }
}
