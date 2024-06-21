
export const cancelPayload = async (orderId:string, buyAccount?:string, buySignature?:string) => {
  let cancel;

  // if (isBuy) {
    cancel = {
      type: 'cancel',
      cancels: [{
        account: buyAccount,
        orderId,
      }],
      signature: buySignature,
    };
  // } else {
  //   cancel = {
  //     type: 'cancel',
  //     cancels: [{
  //       account: sellAccount,
  //       orderId,
  //     }],
  //     signature: sellSignature,
  //   };
  // }
  const response = await fetch('https://orderbook.filament.finance/test/filament/api/v1/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cancel),
  });
  const data = await response.json();
  if (data.status === "notOk"){
    console.log("OrderFailed",data.response.canceledOrders, data)
  }else{
    console.log("Successfully Cancelled")
  }
};
