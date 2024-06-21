import { Schema, model, models, Document } from 'mongoose';

interface IOrder extends Document {
  orderId: string
  collateral: number;
  account: string;
  amount: number;
  side: string;
  indexToken: string;
  time: number
}

const orderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  collateral: {
    type: Number,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  side:{
  type: String,
  required:true
},
  indexToken:{
    type:String,
    required: true
  },
  time:{
    type:Number,
    required:true
  }
});

const Order = models.Order || model<IOrder>('Order', orderSchema);

export default Order;

