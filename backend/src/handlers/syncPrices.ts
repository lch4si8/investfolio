import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import * as db from '../db/queries';
import { getStockQuotes } from '../services/fmp.service';
import { getCryptoPrices, symbolToCoinGeckoId } from '../services/coingecko.service';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const assets = await db.getAllAssets();

    const stockSymbols: string[] = [];
    const cryptoSymbols: string[] = [];

    for (const asset of assets) {
      if (asset.type === 'stock') {
        stockSymbols.push(asset.symbol);
      } else {
        cryptoSymbols.push(asset.symbol);
      }
    }

    // Fetch prices in parallel
    const [stockQuotes, cryptoQuotes] = await Promise.all([
      getStockQuotes(stockSymbols),
      getCryptoPrices(cryptoSymbols.map(s => symbolToCoinGeckoId(s))),
    ]);

    // Update stock prices
    let updatedCount = 0;
    for (const quote of stockQuotes) {
      await db.updateAssetPrice(quote.symbol, quote.price);
      updatedCount++;
    }

    // Update crypto prices
    for (const quote of cryptoQuotes) {
      // Find matching asset by CoinGecko ID → symbol mapping
      const matchingAsset = assets.find(
        a => a.type === 'crypto' && symbolToCoinGeckoId(a.symbol) === quote.id
      );
      if (matchingAsset) {
        await db.updateAssetPrice(matchingAsset.symbol, quote.price);
        updatedCount++;
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: `Synced ${updatedCount} asset prices`,
        stocks: stockQuotes.length,
        crypto: cryptoQuotes.length,
      }),
    };
  } catch (error) {
    console.error('syncPrices error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Failed to sync prices' }),
    };
  }
};

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };
}
