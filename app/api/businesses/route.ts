import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { businesses } from "@/lib/schema"

export async function GET() {
  try {
    const db = getDb()
    const rows = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        type: businesses.type,
        address: businesses.address,
        latitude: businesses.latitude,
        longitude: businesses.longitude,
        avgServiceTime: businesses.avgServiceTime,
        isOpen: businesses.isOpen,
      })
      .from(businesses)
      .orderBy(businesses.id)
      .limit(100)

    return NextResponse.json({ businesses: rows })
  } catch (err: any) {
    console.error("[v0] GET /api/businesses error:", err?.message)
    return NextResponse.json({ error: err?.message || "Failed to load businesses" }, { status: 500 })
  }
}
