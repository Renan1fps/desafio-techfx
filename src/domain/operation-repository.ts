import { Operation, OperationStatus } from "./operation";

export interface OperationRepository {
    findByExternalId(externalId: string): Promise<Operation | null>;
    updateStatus(id: string, status: OperationStatus, reprocessedAt: Date | null): Promise<Operation>;
    insert(data: { external_id: string; amount: number; currency: string; payload_fingerprint: string; }): Promise<Operation>;
}