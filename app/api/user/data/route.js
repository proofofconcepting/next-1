"use server"
import connDB from "@/config/db"
import User from "@/models/User"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const { userId } = getAuth(req)
    // alert(`api > user > data > route.js > user id from getAuth: ${userId}`)
    console.log(
      `api > user > data > route.js > user id from getAuth: ${userId}`
    )

    await connDB()
    const user = await User.findById(userId)
    if (!user)
      return NextResponse.json({
        success: false,
        message: `User not found. id: ${userId}`,
      })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
