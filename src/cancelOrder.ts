
export const cancelPayload = async (orderId:string, isBuy:boolean, buyAccount?:string, buySignature?:string, sellAccount?:string, sellSignature?:string) => {
  
  let cancel;

  if (isBuy) {
    cancel = {
      type: 'cancel',
      cancels: [{
        account: buyAccount,
        orderId,
      }],
      signature: buySignature,
    };
  } else {
    cancel = {
      type: 'cancel',
      cancels: [{
        account: sellAccount,
        orderId,
      }],
      signature: sellSignature,
    };
  }

  const response = await fetch('https://orderbook.filament.finance/test/filament/api/v1/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cancel),
  });
  const data = await response.json();
  console.log(data);
 
};
