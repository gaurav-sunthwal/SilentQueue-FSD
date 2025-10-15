import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { queueEntries } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const entryId = Number(body?.entryId)
    if (!entryId || Number.isNaN(entryId)) {
      return NextResponse.json({ error: "entryId is required" }, { status: 400 })
    }
    
    const db = getDb()
    await db
      .update(queueEntries)
      .set({ status: 'abandoned' })
      .where(eq(queueEntries.id, entryId))
    
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[v0] POST /api/queue/leave error:", err?.message)
    return NextResponse.json({ error: err?.message || "Failed to leave queue" }, { status: 500 })
  }
}
