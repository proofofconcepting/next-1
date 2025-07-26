import mongoose, { mongo } from "mongoose"
// import { unique } from "next/dist/build/utils"

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItrems: { type: Object, default: {} },
  },
  { minimize: false }
)

const User = mongoose.models.user || mongoose.model("use", userSchema)

export default User
