import axios from 'axios';

export const getOpenOrders = async (address: string) => {
  const response = await axios.get(`https://orderbook.filament.finance/test/api/v1/orders/open-orders/account/${address.toLowerCase()}`);
  const orders = response.data;

  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const recentOrders = orders.filter((order: any) => {
    const orderTime = new Date(order.openTime).getTime();
    return orderTime >= fiveMinutesAgo;
  });

  const orderIds = recentOrders.map((order: any) => order.orderId);
  return orderIds;
};
