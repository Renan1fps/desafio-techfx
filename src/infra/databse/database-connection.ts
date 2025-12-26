import 'dotenv/config.js'
import pgPromise, { IDatabase, IMain } from 'pg-promise';

type DB = IDatabase<{}>;

const pgp: IMain = pgPromise({
    capSQL: true
});

const connection = {
    connectionString: String(process.env.DATABASE_URL),
    ssl: false
};

const dbInstance: DB = pgp(connection);

export const databaseConnection = {
    one: async <T>(sql: string, params?: unknown[]): Promise<T> => {
        return dbInstance.one<T>(sql, params);
    },

    oneOrNone: async <T>(sql: string, params?: unknown[]): Promise<T | null> => {
        return dbInstance.oneOrNone<T>(sql, params);
    },
};

