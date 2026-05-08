import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import * as db from '../db/queries';
import { getStockQuote } from '../services/fmp.service';
import { getCryptoPrice, symbolToCoinGeckoId } from '../services/coingecko.service';

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '00000000-0000-0000-0000-000000000001';

interface AddTransactionRequest {
  assetSymbol: string;
  assetType: 'stock' | 'crypto';
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const body: AddTransactionRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.assetSymbol || !body.assetType || !body.type || !body.quantity || !body.price) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Ensure user exists
    await db.getOrCreateUser('default@investfolio.app', 'Default User');

    // Get or create asset — fetch real name from API if possible
    let asset = await db.getAssetBySymbol(body.assetSymbol);
    if (!asset) {
      let assetName = body.assetSymbol;
      let currentPrice = body.price;

      if (body.assetType === 'stock') {
        const quote = await getStockQuote(body.assetSymbol);
        if (quote) {
          assetName = quote.name;
          currentPrice = quote.price;
        }
      } else {
        const coinId = symbolToCoinGeckoId(body.assetSymbol);
        const quote = await getCryptoPrice(coinId);
        if (quote) {
          assetName = quote.name;
          currentPrice = quote.price;
        }
      }

      asset = await db.upsertAsset(body.assetSymbol, assetName, body.assetType, currentPrice);
    }

    // Create transaction
    const transaction = await db.addTransaction(
      DEFAULT_USER_ID,
      asset.id,
      body.type,
      body.quantity,
      body.price,
      body.date || new Date().toISOString()
    );

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify(transaction),
    };
  } catch (error) {
    console.error('addTransaction error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Internal server error' }),
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
