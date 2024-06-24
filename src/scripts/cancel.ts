import { cancelPayload } from "../cancelOrder";
export const IndexTokenAddress: IndexTokenAddressType = {
  SOL: "0x7dff46370e9ea5f0bad3c4e29711ad50062ea7a4",
  ETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
  BTC: "0x152b9d0fdc40c096757f570a51e494bd4b943e50",
  // INJ: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
  // DOGE: "0x9c1cb740f3b631ed53600058ae5b2f83e15d9fbf",
};
type IndexTokenAddressType = {
  [key: string]: string;
};
export const fetchOpenOrders = async (indexToken: string) => {
  const response = await fetch(`https://orderbook.filament.finance/test/api/v1/orders/indexToken/${indexToken}`);
  const orders = await response.json();
  return orders;
};
//cancel for individual token
// export const cancelOrdersBatch = async (indexToken: string) => {
//
//   const orders = await fetchOpenOrders(indexToken);
//   const ordersToCancel = orders.map((order:any) => ({
//     orderId: order.orderId,
//     isBuy: order.isLong === 'BUY',
//     account: order.account,
//     signature: order.signature,
//   }));
//   const cancelPromises = ordersToCancel.map((order:any) =>
//     cancelPayload(order.orderId, order.isBuy, order.account, order.signature)
//   );
//   await Promise.all(cancelPromises);
// };
export const cancelOrdersBatch = async () => {
  const cancelPromises = Object.keys(IndexTokenAddress).map(async (indexToken: string) => {
    const orders = await fetchOpenOrders(IndexTokenAddress[indexToken]);
    console.log(`Fetched all of the open orders of ${indexToken}`);
    const ordersToCancel = orders.map((order: any) => ({
      orderId: order.orderId,
      isBuy: order.isLong === 'BUY',
      account: order.account,
      signature: order.signature,
    }));
    const ordersToCancelLength = ordersToCancel.length;
    console.log(ordersToCancelLength);
    return Promise.all(
      ordersToCancel.map((order: any) => {
        const { orderId, isBuy, account, signature } = order;
        return cancelPayload(
          orderId,
          // isBuy,
          account,
          signature
          // isBuy ? account : undefined,
          // isBuy ? signature : undefined,
          // !isBuy ? account : undefined,
          // !isBuy ? signature : undefined
        );
      })
    );
  });

  await Promise.all(cancelPromises.flat());
  console.log('All cancel requests completed');
};
(async () => {
  setInterval(async () => {
    await cancelOrdersBatch();
  }, 20000); // 20000 milliseconds = 20 seconds
})();

// const cancelOrdersEvery15Sec = () => {
//   const intervalId = setInterval(async () => {
//     try {
//       await cancelOrdersBatch();
//       const ordersRemaining = await Promise.all(
//         Object.keys(IndexTokenAddress).map(indexToken => fetchOpenOrders(IndexTokenAddress[indexToken]))
//       );
//       const totalOrdersRemaining = ordersRemaining.flat().length;
//       if (totalOrdersRemaining === 0) {
//         clearInterval(intervalId);
//         console.log('No more orders to cancel. Exiting process.');
//       }
//     } catch (error) {
//       console.error('Error occurred while canceling orders:', error);
//     }
//   }, 15000); // 15 seconds
// };
//
// cancelOrdersEvery15Sec();
