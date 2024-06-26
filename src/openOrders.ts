import axios from 'axios';

export const getOpenOrders = async (address: string, side: string, token: string) => {
  const response = await axios.get(`https://orderbook.filament.finance/test/api/v1/orders/open-orders/account/${address.toLowerCase()}`,
    {
      params: {
        side: side,
        token: token
      }
    });
  const orders = response.data;
  const orderIds = orders.map((order: any) => order.orderId);
  return orderIds;
};

// (async () => {
//   const orders = await getOpenOrders('0xf45D844281E932170438660349Af191F05Ed846B', "BTC", 'BUY');
//   console.log(orders)
// })()

