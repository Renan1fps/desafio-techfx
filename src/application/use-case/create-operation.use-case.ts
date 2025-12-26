import crypto from 'crypto';
import { Operation, OperationRepository } from "../../domain";

type Input = {
    external_id: string;
    amount: number;
    currency: string;
};

export class CreateOperationUseCase {
    constructor(private readonly repository: OperationRepository) {}

    async execute(input: Input): Promise<Operation> {
        const payloadFingerprint = this.generateFingerprint(input);

        try {
            const operation = await this.repository.insert({
                external_id: input.external_id,
                amount: input.amount,
                currency: input.currency,
                payload_fingerprint: payloadFingerprint
            });
            return this.repository.updateStatus(operation.id, 'SUCCESS', null);

        } catch (error: any) {
            if (this.isUniqueConstraintError(error)) {
                const existing = await this.repository.findByExternalId(input.external_id);
                if (!existing) throw error;
                if (existing.payload_fingerprint !== payloadFingerprint) {
                    throw new Error('Payload conflict for the same external_id');
                }
                return existing;
            }
            throw error;
        }
    }

    private generateFingerprint(input: Input): string {
        const raw = `${input.external_id}:${input.amount}:${input.currency}`;
        return crypto
            .createHash('sha256')
            .update(raw)
            .digest('hex');
    }

    private isUniqueConstraintError(error: any): boolean {
        return error.code === '23505';
    }
}
