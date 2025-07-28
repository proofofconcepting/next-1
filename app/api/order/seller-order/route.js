import connDB from "@/config/db"
import Address from "@/models/Address"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const { userId } = getAuth()
    const isSeller = await authSeller(userId)
    if (!isSeller)
      return NextResponse.json({ success: false, message: "Not authorized." })
    await connDB()
    Address.length
    const orders = await Order.find({}).populate("address items.product")
    NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
