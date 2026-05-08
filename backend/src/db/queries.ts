import { query, queryOne } from './connection';

// ─── Users ──────────────────────────────────────────────
export async function getOrCreateUser(email: string, name: string) {
  const existing = await queryOne(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  if (existing) return existing;

  return queryOne(
    'INSERT INTO users (id, email, name, created_at) VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING *',
    [email, name]
  );
}

// ─── Assets ─────────────────────────────────────────────
export async function upsertAsset(symbol: string, name: string, type: 'stock' | 'crypto', price: number) {
  return queryOne(
    `INSERT INTO assets (id, symbol, name, type, current_price, price_updated_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
     ON CONFLICT (symbol) DO UPDATE SET
       name = EXCLUDED.name,
       current_price = EXCLUDED.current_price,
       price_updated_at = NOW()
     RETURNING *`,
    [symbol, name, type, price]
  );
}

export async function getAssetBySymbol(symbol: string) {
  return queryOne('SELECT * FROM assets WHERE symbol = $1', [symbol]);
}

export async function getAllAssets() {
  return query('SELECT * FROM assets ORDER BY symbol');
}

export async function updateAssetPrice(symbol: string, price: number) {
  return queryOne(
    'UPDATE assets SET current_price = $2, price_updated_at = NOW() WHERE symbol = $1 RETURNING *',
    [symbol, price]
  );
}

// ─── Transactions ───────────────────────────────────────
export async function getTransactions(userId: string) {
  return query(
    `SELECT t.*, row_to_json(a.*) as asset
     FROM transactions t
     JOIN assets a ON a.id = t.asset_id
     WHERE t.user_id = $1
     ORDER BY t.transaction_date DESC`,
    [userId]
  );
}

export async function addTransaction(
  userId: string,
  assetId: string,
  type: 'buy' | 'sell',
  quantity: number,
  price: number,
  date: string
) {
  return queryOne(
    `INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [userId, assetId, type, quantity, price, date]
  );
}

export async function deleteTransaction(id: string, userId: string) {
  return queryOne(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
}

// ─── Portfolio ──────────────────────────────────────────
export async function getPortfolioHoldings(userId: string) {
  return query(
    `SELECT
       a.id as asset_id,
       a.symbol,
       a.name,
       a.type,
       a.current_price,
       a.price_updated_at,
       SUM(CASE WHEN t.type = 'buy' THEN t.quantity ELSE -t.quantity END) as net_quantity,
       SUM(CASE WHEN t.type = 'buy' THEN t.quantity * t.price_at_transaction ELSE 0 END) as total_cost,
       SUM(CASE WHEN t.type = 'buy' THEN t.quantity ELSE 0 END) as total_bought
     FROM transactions t
     JOIN assets a ON a.id = t.asset_id
     WHERE t.user_id = $1
     GROUP BY a.id, a.symbol, a.name, a.type, a.current_price, a.price_updated_at
     HAVING SUM(CASE WHEN t.type = 'buy' THEN t.quantity ELSE -t.quantity END) > 0
     ORDER BY a.type, a.symbol`,
    [userId]
  );
}
