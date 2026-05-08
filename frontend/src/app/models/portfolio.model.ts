export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  currentPrice: number;
  priceUpdatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  type: 'buy' | 'sell';
  quantity: number;
  priceAtTransaction: number;
  transactionDate: string;
  createdAt: string;
  // Joined fields
  asset?: Asset;
}

export interface PortfolioSummary {
  totalNetWorth: number;
  stocksValue: number;
  cryptoValue: number;
  stocksPercentage: number;
  cryptoPercentage: number;
  holdings: Holding[];
}

export interface Holding {
  asset: Asset;
  quantity: number;
  avgCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}
