import DbConnection from "../connection";
export const removeClosedOrdersFromDb = async (closedOrderIds: string[]) => {
  try {
    let db = await DbConnection.Get();
    await db.collection('orders').deleteMany({ orderId: { $in: closedOrderIds } });
    console.log('Removed closed orders from MongoDB');
  } catch (error) {
    console.error('Error removing closed orders from MongoDB:', error);
  }
};
