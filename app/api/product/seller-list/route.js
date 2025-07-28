import connDB from "@/config/db"
import authSeller from "@/lib/authSeller"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Product from "@/models/Product"

export async function GET(req) {
  try {
    const { userId } = getAuth(req)
    const isSeler = authSeller(userId)
    if (!isSeler)
      return NextResponse.json({ success: false, message: "Unauthorized." })
    await connDB()
    const products = await Product.find({})
    return NextResponse.json({ success: true, products })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
