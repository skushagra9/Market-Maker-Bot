import { saveToDb } from "./mongo/actions/saveOrders";
export async function processOrders(priceChanges: any, isBuy: boolean, asset: string, account: string, signature: string) {
  for (const changeKey of Object.keys(priceChanges)) {
    const changeValue = priceChanges[changeKey];
    console.log(changeKey, changeValue, 'me');
    const payload = {
      type: 'order',
      referralCode: null,
      orders: [
        {
          account: account,
          indexToken: asset,
          isBuy,
          size: 1000,
          leverage: 25,
          reduceOnly: false,
          orderType: {
            type: 'limit',
            limit: {
              tif: 'Gtc',
              limitPrice: changeValue,
            },
          },
        },
      ],
      signature: signature,
    };

    try {
      const response = await fetch('https://orderbook.filament.finance/test/filament/api/v1/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === "ok") {
        console.log(`Order created successfully:`, data);
        const { orderId, account, indexToken, isBuy, size, leverage } = data.response.orders
        await saveToDb(orderId, account, indexToken, isBuy, size, leverage);
      } else {
        console.log("Order Creation Failed", data.response.orders[0].orderId)
      }
    } catch (error) {
      console.error(`Error creating ${isBuy ? 'buy' : 'sell'} order:`, error);
    }
  }
}

