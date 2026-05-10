-- ══════════════════════════════════════════════════════════
-- InvestFolio — Seed Data (Mock Portfolio)
-- Run after 001_init.sql to populate a demo portfolio
-- ══════════════════════════════════════════════════════════

-- ─── Assets: Stocks ─────────────────────────────────────
INSERT INTO assets (id, symbol, name, type, current_price, price_updated_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'AAPL',  'Apple Inc.',            'stock',  198.11000000, NOW()),
  ('a0000000-0000-0000-0000-000000000002', 'MSFT',  'Microsoft Corporation', 'stock',  430.52000000, NOW()),
  ('a0000000-0000-0000-0000-000000000003', 'GOOGL', 'Alphabet Inc.',         'stock',  175.30000000, NOW()),
  ('a0000000-0000-0000-0000-000000000004', 'AMZN',  'Amazon.com Inc.',       'stock',  189.45000000, NOW()),
  ('a0000000-0000-0000-0000-000000000005', 'TSLA',  'Tesla Inc.',            'stock',  178.20000000, NOW()),
  ('a0000000-0000-0000-0000-000000000006', 'NVDA',  'NVIDIA Corporation',    'stock',  131.88000000, NOW())
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  current_price = EXCLUDED.current_price,
  price_updated_at = NOW();

-- ─── Assets: Crypto ─────────────────────────────────────
INSERT INTO assets (id, symbol, name, type, current_price, price_updated_at) VALUES
  ('a0000000-0000-0000-0000-000000000101', 'BTC',  'Bitcoin',  'crypto', 103500.00000000, NOW()),
  ('a0000000-0000-0000-0000-000000000102', 'ETH',  'Ethereum', 'crypto',   2430.75000000, NOW()),
  ('a0000000-0000-0000-0000-000000000103', 'SOL',  'Solana',   'crypto',    172.60000000, NOW()),
  ('a0000000-0000-0000-0000-000000000104', 'ADA',  'Cardano',  'crypto',      0.78500000, NOW())
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  current_price = EXCLUDED.current_price,
  price_updated_at = NOW();

-- ─── Transactions: Stock Buys ───────────────────────────
-- Default user: 00000000-0000-0000-0000-000000000001

-- Apple — 2 buys
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   'buy', 15.00000000, 172.50000000, '2024-11-15 10:30:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   'buy', 10.00000000, 189.20000000, '2025-02-03 14:15:00+00', NOW());

-- Microsoft — 1 buy
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000002',
   'buy', 8.00000000, 390.75000000, '2024-12-10 09:00:00+00', NOW());

-- Alphabet — 1 buy
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000003',
   'buy', 20.00000000, 152.80000000, '2025-01-08 11:45:00+00', NOW());

-- Amazon — 2 buys
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000004',
   'buy', 12.00000000, 178.30000000, '2025-01-20 16:00:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000004',
   'buy', 5.00000000, 185.90000000, '2025-03-14 13:30:00+00', NOW());

-- Tesla — 1 buy + 1 sell (partial)
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000005',
   'buy', 25.00000000, 165.40000000, '2024-12-22 10:00:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000005',
   'sell', 10.00000000, 195.00000000, '2025-04-01 15:20:00+00', NOW());

-- NVIDIA — 1 buy
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000006',
   'buy', 30.00000000, 118.50000000, '2025-02-18 09:30:00+00', NOW());

-- ─── Transactions: Crypto Buys ──────────────────────────

-- Bitcoin — 2 buys
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000101',
   'buy', 0.15000000, 68500.00000000, '2024-11-20 08:00:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000011',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000101',
   'buy', 0.10000000, 95200.00000000, '2025-03-05 12:00:00+00', NOW());

-- Ethereum — 2 buys + 1 sell
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000012',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000102',
   'buy', 3.00000000, 2050.00000000, '2024-12-01 07:30:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000013',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000102',
   'buy', 2.00000000, 2350.00000000, '2025-02-10 19:00:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000014',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000102',
   'sell', 1.00000000, 2680.00000000, '2025-04-12 10:45:00+00', NOW());

-- Solana — 1 buy
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000015',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000103',
   'buy', 50.00000000, 135.20000000, '2025-01-15 14:00:00+00', NOW());

-- Cardano — 2 buys
INSERT INTO transactions (id, user_id, asset_id, type, quantity, price_at_transaction, transaction_date, created_at) VALUES
  ('t0000000-0000-0000-0000-000000000016',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000104',
   'buy', 5000.00000000, 0.62000000, '2024-11-28 16:30:00+00', NOW()),

  ('t0000000-0000-0000-0000-000000000017',
   '00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000104',
   'buy', 3000.00000000, 0.71000000, '2025-03-20 08:15:00+00', NOW());

-- ══════════════════════════════════════════════════════════
-- Summary of seeded portfolio:
-- ══════════════════════════════════════════════════════════
-- STOCKS:
--   AAPL  — 25 shares  (avg ~$179.18)
--   MSFT  —  8 shares  (avg  $390.75)
--   GOOGL — 20 shares  (avg  $152.80)
--   AMZN  — 17 shares  (avg ~$180.54)
--   TSLA  — 15 shares  (avg  $165.40) [bought 25, sold 10]
--   NVDA  — 30 shares  (avg  $118.50)
--
-- CRYPTO:
--   BTC   —  0.25 BTC  (avg ~$79,180)
--   ETH   —  4.00 ETH  (avg ~$2,170) [bought 5, sold 1]
--   SOL   — 50.00 SOL  (avg  $135.20)
--   ADA   — 8000 ADA   (avg ~$0.654)
-- ══════════════════════════════════════════════════════════
