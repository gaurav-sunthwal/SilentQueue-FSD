import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as any
    const email = (body?.email || "").toString().trim()
    const name = (body?.name || "Guest").toString().trim() || "Guest"

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const res = NextResponse.json({ ok: true, user: { email, name } })
    const isProd = process.env.NODE_ENV === 'production'
    res.cookies.set("sq_auth", JSON.stringify({ email, name }), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isProd,
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Login failed" }, { status: 500 })
  }
}


