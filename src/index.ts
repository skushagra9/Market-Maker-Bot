import { getCryptoPrices } from "./getPrices";
import { calculatePriceChangesbuy, calculatePriceChangesSell } from "./utils";
import { processOrders } from "./processOrder";
import DbConnection from "./mongo/connection";
import dotenv from 'dotenv';
import { checkBalance } from "./balance";
import { getOpenOrders } from "./openOrders";
import { getClosedOrders } from "./orderHistory";
import { cancelPayload } from "./cancelOrder";
dotenv.config();

const buyAccount =  process.env.BUY_ACCOUNT as string;
const sellAccount = process.env.SELL_ACCOUNT as string;
const buySignature = process.env.BUY_SIGNATURE as string;
const sellSignature = process.env.SELL_SIGNATURE as string;
const assets = ["BTC", "ETH", "SOL"]

async function saveToDb(orderId:string, account:string, indexToken:string, isBuy:boolean, size:number, leverage:number) {
try {
    let db = await DbConnection.Get();
    const collateral = size / leverage;
    const amount = size; 
    const side = isBuy ? 'BUY' : 'SELL';
 const timestamp = Date.now(); 
    await db.collection('orders').insertOne({
      orderId,
      collateral,
      account,
      amount,
      side,
      indexToken,
      timestamp
    });
    console.log('Order saved successfully');
  } catch (error) {
    console.error('Error saving order to MongoDB:', error);
  }
};

const removeClosedOrdersFromDb = async (closedOrderIds: string[]) => {
  try {
    let db = await DbConnection.Get();
    await db.collection('orders').deleteMany({ orderId: { $in: closedOrderIds } });
    console.log('Removed closed orders from MongoDB');
  } catch (error) {
    console.error('Error removing closed orders from MongoDB:', error);
  }
};

async function buy(asset:string) {
  try {
    const price = await getCryptoPrices(asset);
    const priceChangesbuy = calculatePriceChangesbuy(price);
    const {orderId, account, indexToken, isBuy, size, leverage} = await processOrders(priceChangesbuy, true, asset,  buyAccount, buySignature);
    await saveToDb(orderId, account, indexToken, isBuy, size, leverage); 
  } catch (error) {
    console.error('Error running price change calculation:', error);
  }
}

async function sell(asset:string) {
  try {
    const price = await getCryptoPrices(asset);
    const priceChangesSell = calculatePriceChangesSell(price);
    const {orderId, account, indexToken, isBuy, size, leverage} = await processOrders(priceChangesSell, false, asset, sellAccount, sellSignature);
      await saveToDb(orderId, account, indexToken, isBuy, size, leverage); 
  } catch (error) {
    console.error('Error running price change calculation:', error);
  }
}

const main = async (asset:string) => {
  try {
    console.log(`Starting script for ${asset}`);
    const { count: buyCount, remainingBalance: buyRemainingBalance } = await checkBalance(buyAccount);
    console.log(`BUY_ACCOUNT can place orders for $40 collateral: ${buyCount} times, remaining balance: ${buyRemainingBalance}`);

    const { count: sellCount, remainingBalance: sellRemainingBalance } = await checkBalance(sellAccount);
    console.log(`SELL_ACCOUNT can place orders for $40: ${sellCount} times, remaining balance: ${sellRemainingBalance}`);

    const buyOpenOrders = await getOpenOrders(buyAccount);
    const buyClosedOrders = await getClosedOrders(buyAccount);

    const sellOpenOrders = await getOpenOrders(sellAccount);
    const sellClosedOrders = await getClosedOrders(sellAccount);

    await removeClosedOrdersFromDb([...buyClosedOrders, ...sellClosedOrders]);

    if (buyCount >= 5 && sellCount >= 5) {
      await buy(asset);
    await sell(asset);

    } else {
      console.log('Not enough collateral to place 5 trades on both buy and sell sides');
    }

    for (const order of buyOpenOrders) {
      await cancelPayload(order.orderId, true, buyAccount, buySignature); 
    }

    for (const order of sellOpenOrders) {
      await cancelPayload(order.orderId, false, sellAccount, sellSignature); 
    }

    let db = await DbConnection.Get();
    await db.collection('orders').deleteMany({});
    console.log('Cleared database');
  } catch (error) {
    console.error('Error in main script:', error);
  }
};

assets.map(async(asset) => await main(asset))


