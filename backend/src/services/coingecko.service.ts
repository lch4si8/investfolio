// CoinGecko API — Crypto price fetcher
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoQuote {
  id: string;
  symbol: string;
  name: string;
  price: number;
}

export async function getCryptoPrice(coinId: string): Promise<CryptoQuote | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${encodeURIComponent(coinId)}&vs_currencies=usd&include_24hr_change=true`
    );
    if (!response.ok) return null;

    const data = (await response.json()) as Record<string, { usd: number }>;
    if (!data[coinId]) return null;

    return {
      id: coinId,
      symbol: coinId.toUpperCase(),
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      price: data[coinId].usd,
    };
  } catch (error) {
    console.error(`CoinGecko error for ${coinId}:`, error);
    return null;
  }
}

export async function getCryptoPrices(coinIds: string[]): Promise<CryptoQuote[]> {
  if (coinIds.length === 0) return [];

  try {
    const joined = coinIds.join(',');
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${encodeURIComponent(joined)}&vs_currencies=usd`
    );
    if (!response.ok) return [];

    const data = (await response.json()) as Record<string, { usd: number }>;

    return Object.entries(data).map(([id, values]) => ({
      id,
      symbol: id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: values.usd,
    }));
  } catch (error) {
    console.error('CoinGecko bulk error:', error);
    return [];
  }
}

// Map common symbols to CoinGecko IDs
export function symbolToCoinGeckoId(symbol: string): string {
  const map: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    ADA: 'cardano',
    DOT: 'polkadot',
    DOGE: 'dogecoin',
    AVAX: 'avalanche-2',
    MATIC: 'matic-network',
    LINK: 'chainlink',
    UNI: 'uniswap',
    XRP: 'ripple',
    BNB: 'binancecoin',
    ATOM: 'cosmos',
    NEAR: 'near',
    APT: 'aptos',
  };
  return map[symbol.toUpperCase()] || symbol.toLowerCase();
}
