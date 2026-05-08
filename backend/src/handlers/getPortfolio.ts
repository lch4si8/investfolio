import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getPortfolioHoldings } from '../db/queries';

// Default user ID (simplified — in production, extract from JWT/Cognito)
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '00000000-0000-0000-0000-000000000001';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const holdings = await getPortfolioHoldings(DEFAULT_USER_ID);

    let stocksValue = 0;
    let cryptoValue = 0;
    const mappedHoldings = holdings.map((h: any) => {
      const netQty = parseFloat(h.net_quantity);
      const currentPrice = parseFloat(h.current_price);
      const totalCost = parseFloat(h.total_cost);
      const totalBought = parseFloat(h.total_bought);
      const avgCost = totalBought > 0 ? totalCost / totalBought : 0;
      const currentValue = netQty * currentPrice;
      const costBasis = netQty * avgCost;
      const profitLoss = currentValue - costBasis;
      const profitLossPercentage = costBasis > 0 ? profitLoss / costBasis : 0;

      if (h.type === 'stock') stocksValue += currentValue;
      else cryptoValue += currentValue;

      return {
        asset: {
          id: h.asset_id,
          symbol: h.symbol,
          name: h.name,
          type: h.type,
          currentPrice,
          priceUpdatedAt: h.price_updated_at,
        },
        quantity: netQty,
        avgCost,
        currentValue,
        profitLoss,
        profitLossPercentage,
      };
    });

    const totalNetWorth = stocksValue + cryptoValue;

    const portfolio = {
      totalNetWorth,
      stocksValue,
      cryptoValue,
      stocksPercentage: totalNetWorth > 0 ? stocksValue / totalNetWorth : 0,
      cryptoPercentage: totalNetWorth > 0 ? cryptoValue / totalNetWorth : 0,
      holdings: mappedHoldings,
    };

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(portfolio),
    };
  } catch (error) {
    console.error('getPortfolio error:', error);
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
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
  };
}
