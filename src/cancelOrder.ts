
export const cancelPayload = async (orderId:string, account?:string, signature?:string) => {
    const cancel = {
      type: 'cancel',
      cancels: [{
        account: account,
        orderId,
      }],
      signature: signature,
    };
  const response = await fetch('https://orderbook.filament.finance/test/filament/api/v1/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cancel),
  });
  const data = await response.json();
  if (data.status === "notOk"){
    console.log("OrderFailed",data.response.canceledOrders)
  }else{
    console.log("Successfully Cancelled", data.response.canceledOrders)
  }
};
