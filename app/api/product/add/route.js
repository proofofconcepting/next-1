// import { v2 as cloudinary } from "next-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import { getAuth } from "@clerk/nextjs/server"
import authSeller from "@/lib/authSeller"
import { NextResponse } from "next/server"
import connDB from "@/config/db"
import Product from "@/models/Product"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    const isSeler = await authSeller()
    if (!isSeler)
      return NextResponse.json({ success: false, message: "Not authorized." })
    const formData = await req?.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const category = formData.get("category")
    const price = formData.get("price")
    const offerPrice = formData.get("offerPrice")
    const files = formData.getAll("images")
    if (!files || files.length === 0)
      return NextResponse.json({
        success: false,
        message: "No files uploaded.",
      })
    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        return new Promise((res, rej) => {
          const stream = cloudinary.uploader.upload_stream(
            { resrouce_type: "auto" },
            (error, result) => {
              if (error) return rej(error)
              else return res(result)
            }
          )
          stream.end(buffer)
        })
      })
    )
    const image = result.map((result) => result.secure_url)
    if (!image) {
      return
    }

    await connDB()
    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image,
      date: Date.now(),
    })
    return NextResponse.json({
      success: true,
      message: "Upload succeeded.",
      newProduct,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Your error msg: ${error.message}`,
    })
  }
}
