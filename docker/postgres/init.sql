CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS operations (
    id UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id             TEXT NOT NULL,
    amount                  NUMERIC(18,2) NOT NULL,
    currency                TEXT NOT NULL,
    payload_fingerprint     TEXT NOT NULL,
    status                  TEXT NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    reprocessed_at          TIMESTAMP NULL
    );

CREATE UNIQUE INDEX IF NOT EXISTS ux_operations_external_id
    ON operations (external_id);
