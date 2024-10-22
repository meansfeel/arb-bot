const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET
});

const getPrice = async (symbol) => {
  try {
    const ticker = await binance.prices(symbol);
    return ticker[symbol];
  } catch (error) {
    console.error('获取价格失败', error);
    throw error;
  }
};

const executeTrade = async (symbol, side, quantity) => {
  try {
    if (side === 'BUY') {
      return await binance.marketBuy(symbol, quantity);
    } else if (side === 'SELL') {
      return await binance.marketSell(symbol, quantity);
    }
  } catch (error) {
    console.error('执行交易失败', error);
    throw error;
  }
};

module.exports = {
  getPrice,
  executeTrade
};
