// FMP (Financial Modeling Prep) — Stock price fetcher
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';
const FMP_API_KEY = process.env.FMP_API_KEY || '';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${FMP_API_KEY}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    let item = null;
    
    if (Array.isArray(data)) {
      item = data.length > 0 ? data[0] : null;
    } else if (data && Array.isArray(data.data)) {
      item = data.data.length > 0 ? data.data[0] : null;
    } else if (data && Array.isArray(data.results)) {
      item = data.results.length > 0 ? data.results[0] : null;
    } else if (data && typeof data === 'object') {
      // Direct object or wrapped differently
      item = data;
    }

    if (!item || !item.symbol || item.price === undefined) return null;

    return {
      symbol: item.symbol,
      name: item.name || item.symbol,
      price: Number(item.price),
    };
  } catch (error) {
    console.error(`FMP error for ${symbol}:`, error);
    return null;
  }
}

export async function getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (symbols.length === 0) return [];

  try {
    const promises = symbols.map(sym => getStockQuote(sym));
    const results = await Promise.all(promises);
    return results.filter(q => q !== null) as StockQuote[];
  } catch (error) {
    console.error('FMP bulk error:', error);
    return [];
  }
}
