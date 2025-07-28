import connDB from "@/config/db"
import Address from "@/models/Address"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import authSeller from "@/lib/authSeller"
import Order from "@/models/Order"

export async function GET(req) {
  try {
    const { userId } = getAuth(req)
    const isSeller = await authSeller(userId)
    if (!isSeller)
      return NextResponse.json({ success: false, message: "Not authorized." })
    await connDB()
    Address.length
    const orders = await Order.find({}).populate("address items.product")
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
