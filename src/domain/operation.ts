export type OperationStatus = 'PROCESSING' | 'SUCCESS' | 'FAILED';

export type Operation = {
    id: string;
    external_id: string;
    amount: number;
    currency: string;
    payload_fingerprint: string;
    status: OperationStatus;
    created_at: Date;
    updated_at: Date;
    reprocessed_at: Date | null;
};
