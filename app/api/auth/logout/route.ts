import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  const isProd = process.env.NODE_ENV === 'production'
  res.cookies.set("sq_auth", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isProd,
    maxAge: 0,
  })
  return res
}


