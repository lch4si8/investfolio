-- InvestFolio Database Schema
-- PostgreSQL 16 compatible

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Assets ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('stock', 'crypto')),
    current_price DECIMAL(18, 8) DEFAULT 0,
    price_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Transactions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    type VARCHAR(4) NOT NULL CHECK (type IN ('buy', 'sell')),
    quantity DECIMAL(18, 8) NOT NULL CHECK (quantity > 0),
    price_at_transaction DECIMAL(18, 8) NOT NULL CHECK (price_at_transaction >= 0),
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_asset_id ON transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_assets_symbol ON assets(symbol);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);

-- ─── Default user (for development) ────────────────────
INSERT INTO users (id, email, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'default@investfolio.app', 'Default User')
ON CONFLICT (email) DO NOTHING;
