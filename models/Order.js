import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  items: [
    {
      product: { type: String, required: true, ref: "product" },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: String, ref: "address" },
  isPaied: { type: Boolean, required: true, default: false },
  stripeSessionID: { type: String, default: "" },
  checkoutFailed: { type: Number, required: true, default: 0 },
  date: { type: Number, required: true, default: Date.now() },
})

const Order = mongoose.models.order || mongoose.model("order", orderSchema)

export default Order
