import { Pool, PoolConfig } from 'pg';

const useSSL = process.env.DB_SSL === 'true';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'investfolio',
  user: process.env.DB_USER || 'investfolio',
  password: process.env.DB_PASSWORD || 'password',
  max: 3, // Keep pool small for Lambda concurrency
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Keep-alive for Lambda cold starts
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  // SSL for public RDS endpoint
  ...(useSSL && {
    ssl: { rejectUnauthorized: false },
  }),
};

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(poolConfig);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}
