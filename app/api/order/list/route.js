import connDB from "@/config/db"
import Address from "@/models/Address"
import Product from "@/models/Product"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const { userId } = getAuth()
    await connDB()
    await Address.length
    await Product.length
    const orders = await Orders.find({ userId }).populate(
      `address items.product`
    )
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
