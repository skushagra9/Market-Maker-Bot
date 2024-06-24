// import axios from "axios";
// export const getClosedOrders = async (address: string) => {
//   const response = await axios.get(`https://orderbook.filament.finance/test/api/v1/orders/closed-orders/account/${address.toLowerCase()}`);
//   const orders = response.data;
//
//   const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
//   const recentOrders = orders.filter((order: any) => {
//     const orderTime = new Date(order.openTime).getTime();
//     return orderTime >= fiveMinutesAgo && order.orderStatus === 'MATCHED';  });
//   console.log(recentOrders,"kushagra")
//
//   const orderIds = recentOrders.map((order: any) => order.orderId);
//   return orderIds;
// };
import axios from "axios";

export const getClosedOrders = async (address: string, side: string, token: string) => {
  const response = await axios.get(`https://orderbook.filament.finance/test/api/v1/orders/closed-orders/account/${address.toLowerCase()}`,
    {
      params: {
        side: side,
        token: token
      }
    }
  );
  const orders = response.data;

  const matchedOrders = orders.filter((order: any) => order.orderStatus === 'MATCHED');

  const orderIds = matchedOrders.map((order: any) => order.orderId);
  return orderIds;
};
