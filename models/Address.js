import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  fullName: { type: String, required: true },
  PhoneNumber: { type: String, required: true, default: "+1 (111) 111-11-11" },
  pinCode: { type: Number, required: true, default: 111 },
  area: { type: String, required: true, default: "fesparfofo" },
  city: { type: String, required: true, default: "fofonfo" },
  state: { type: String, required: true, default: "fofafio" },
})

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema)

export default Address
