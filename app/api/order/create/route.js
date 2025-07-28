// import connDB from "@/config/db"
import { inngest } from "@/config/inngest"
import Product from "@/models/Product"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    const { address, items } = await req.json()
    if (!address || items?.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" })
    }
    // await connDB()
    const amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product)
      const calculated = (await acc) + product.offerPrice * item.quantity
      return calculated
    }, 0)
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now(),
      },
    })
    const user = await User.findById(userId)
    user.cartItems = {}
    await user.save()
    return NextResponse.json({ success: true, message: "Order placed." })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
