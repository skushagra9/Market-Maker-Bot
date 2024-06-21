export async function processOrders(priceChanges:any, isBuy:boolean, asset:string,  account:string, signature:string) {
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
      console.log(`${isBuy ? 'Buy' : 'Sell'} order created successfully:`, data);
      // console.log(data.response.orders.orderId);
            // console.log(data.response.orders);
      if (data.response.status === "ok") {
        return data.response.orders
      }
      // orders.push({ id: data.response.orders.orderId, isBuy });
    } catch (error) {
      console.error(`Error creating ${isBuy ? 'buy' : 'sell'} order:`, error);
    }
  }
}

