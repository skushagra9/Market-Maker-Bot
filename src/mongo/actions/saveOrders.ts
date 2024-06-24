import DbConnection from "../connection";
export async function saveToDb(orderId: string, account: string, indexToken: string, isBuy: boolean, size: number, leverage: number) {
  try {
    let db = await DbConnection.Get();
    const collateral = size / leverage;
    const amount = size;
    const side = isBuy ? 'BUY' : 'SELL';
    const timestamp = Date.now();
    await db.collection('orders').insertOne({
      orderId,
      collateral,
      account,
      amount,
      side,
      indexToken,
      timestamp
    });
    console.log('Order saved successfully');
  } catch (error) {
    console.error('Error saving order to MongoDB:', error);
  }
};
