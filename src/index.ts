import { getCryptoPrices } from "./getPrices";
import { calculatePriceChangesbuy, calculatePriceChangesSell } from "./utils";
import { processOrders } from "./processOrder";
import dotenv from 'dotenv';
import { checkBalance } from "./balance";
import { getOpenOrders } from "./openOrders";
import { getClosedOrders } from "./orderHistory";
import { cancelPayload } from "./cancelOrder";
import { removeClosedOrdersFromDb } from "./mongo/actions/deleteOrders";
import DbConnection from "./mongo/connection";
import cluster from 'cluster';
import os from 'os';
dotenv.config();

const buyAccount =  process.env.BUY_ACCOUNT as string;
const sellAccount = process.env.SELL_ACCOUNT as string;
const buySignature = process.env.BUY_SIGNATURE as string;
const sellSignature = process.env.SELL_SIGNATURE as string;
const assets = ["BTC", "ETH", "SOL"]
let tasksCompleted = false;
async function buy(asset:string) {
  try {
    const price = await getCryptoPrices(asset);
    const priceChangesbuy = calculatePriceChangesbuy(price);
   await processOrders(priceChangesbuy, true, asset,  buyAccount, buySignature);
  } catch (error) {
    console.error('Error running price change calculation:', error);
  }
}

async function sell(asset:string) {
  try {
    const price = await getCryptoPrices(asset);
    const priceChangesSell = calculatePriceChangesSell(price);
   await processOrders(priceChangesSell, false, asset, sellAccount, sellSignature);
  } catch (error) {
    console.error('Error running price change calculation:', error);
  }
}

const main = async (asset:string) => {
  try {
    console.log(`Starting script for ${asset}`);
    const { count: buyCount, remainingBalance: buyRemainingBalance } = await checkBalance(buyAccount);
    console.log(`BUY_ACCOUNT can place orders for $40 collateral: ${buyCount} times, remaining balance after placing all of the orders: ${buyRemainingBalance}`);

    const { count: sellCount, remainingBalance: sellRemainingBalance } = await checkBalance(sellAccount);
    console.log(`SELL_ACCOUNT can place orders for $40: ${sellCount} times, remaining balance after placing all of the orders: ${sellRemainingBalance}`);

    const buyOpenOrders = await getOpenOrders(buyAccount);
    const buyClosedOrders = await getClosedOrders(buyAccount);

    const sellOpenOrders = await getOpenOrders(sellAccount);
    const sellClosedOrders = await getClosedOrders(sellAccount);

    await removeClosedOrdersFromDb([...buyClosedOrders, ...sellClosedOrders]);

    if (buyCount >= 5 ) {
      await buy(asset);
    await sell(asset);

    } else {
      console.log('Not enough collateral to place 5 trades on both buy and sell sides');
    }
console.log(buyOpenOrders, sellOpenOrders)
    for (const order of buyOpenOrders) {
      await cancelPayload(order, buyAccount, buySignature); 
    }

    for (const order of sellOpenOrders) {
      await cancelPayload(order, sellAccount, sellSignature); 
    }

    let db = await DbConnection.Get();
    await db.collection('orders').deleteMany({});
    console.log('Cleared database');
    tasksCompleted = true;
    process.exit(0);
  } catch (error) {
    console.error('Error in main script:', error);
  }
};
if (cluster.isPrimary) {
  const numWorkers = Math.min(os.cpus().length, assets.length);

  console.log(`Primary cluster setting up ${numWorkers} workers...`);

  assets.forEach((asset) => {
    const worker = cluster.fork();
    worker.send({ asset });
  });

  cluster.on('online', function (worker) {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log(`Worker ${worker.process.pid} exited with code: ${code}, and signal: ${signal}`);
    if (!tasksCompleted && code !== 0 && assets.length > 0) {
      console.log('Starting a new worker');
      const newWorker = cluster.fork();
      newWorker.send({ asset: assets.pop() });
    }
  });
} else {
  process.on('message', async function (message:any) {
    await main(message.asset);
  });
}
