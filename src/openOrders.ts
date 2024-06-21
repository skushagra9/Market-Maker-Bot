import axios from 'axios';
import moment from 'moment';

export const getOpenOrders = async (address: string) => {
  const response = await axios.get(`https://orderbook.filament.finance/test/api/v1/orders/open-orders/account/${address.toLowerCase()}`);
  const orders = response.data;

  // const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate().getTime();
  //
  // const recentOrders = orders.filter((order: any) => {
  //   const orderTime = moment(order.openTime, 'DD/MM/YYYY - HH:mm:ss').toDate().getTime();
  //   console.log(orderTime , fiveMinutesAgo)
  //   return orderTime >= fiveMinutesAgo;
  // });

  const orderIds = orders.map((order: any) => order.orderId);
  return orderIds;
};
