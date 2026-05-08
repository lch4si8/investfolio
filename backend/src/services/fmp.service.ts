// FMP (Financial Modeling Prep) — Stock price fetcher
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const FMP_API_KEY = process.env.FMP_API_KEY || '';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/quote/${encodeURIComponent(symbol)}?apikey=${FMP_API_KEY}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      symbol: data[0].symbol,
      name: data[0].name,
      price: data[0].price,
    };
  } catch (error) {
    console.error(`FMP error for ${symbol}:`, error);
    return null;
  }
}

export async function getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (symbols.length === 0) return [];

  try {
    const joined = symbols.join(',');
    const response = await fetch(
      `${FMP_BASE_URL}/quote/${encodeURIComponent(joined)}?apikey=${FMP_API_KEY}`
    );
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      symbol: item.symbol,
      name: item.name,
      price: item.price,
    }));
  } catch (error) {
    console.error('FMP bulk error:', error);
    return [];
  }
}
