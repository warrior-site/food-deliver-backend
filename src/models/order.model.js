import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodPartner",
    required: true
  },
  foodItems: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
      name: String,
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["placed", "preparing", "out-for-delivery", "delivered", "cancelled"], 
    default: "placed" 
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
