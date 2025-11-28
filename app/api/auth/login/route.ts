import { NextResponse } from "next/server"
import { validateCredentials, generateToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!validateCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken()
    const cookieStore = await cookies()

    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("error : ",error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
