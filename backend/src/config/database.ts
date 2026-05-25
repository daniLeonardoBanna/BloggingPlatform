import { Client } from 'pg';
import { DataSource } from 'typeorm';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.db.synchronize, // NEVER true in production
  logging: env.db.logging,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../entities/**/*.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
  subscribers: [__dirname + '/../subscribers/**/*.{ts,js}'],
  extra: {
    // Connection pool settings
    max: 20, // max pool size
    min: 2, // min pool size
    acquire: 30000, // max ms to get connection before throwing
    idle: 10000, // ms a connection can sit idle before being released
  },
});

const ensureDatabase = async (): Promise<void> => {
  const client = new Client({
    host: env.db.host,
    port: env.db.port,
    user: env.db.username,
    password: env.db.password,
    database: 'postgres',
  });

  await client.connect();

  const result = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [env.db.database],
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${env.db.database}"`);
    console.log(`Database "${env.db.database}" created.`);
  }

  await client.end();
};

export const connectDatabase = async (): Promise<void> => {
  await ensureDatabase();
  await AppDataSource.initialize();
};
