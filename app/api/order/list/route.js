import connDB from "@/config/db"
import Address from "@/models/Address"
import Product from "@/models/Product"
import Order from "@/models/Order"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const { userId } = getAuth(req)

    await connDB()
    await Address.length
    await Product.length
    const orders = await Order.find({ userId }).populate(
      `address items.product`
    )
    const jsonResponse = { success: true, orders }

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
