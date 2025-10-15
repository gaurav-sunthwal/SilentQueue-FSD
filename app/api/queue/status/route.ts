import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { queueEntries, businesses } from "@/lib/schema"
import { eq, and, lte, count } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const entryId = Number(url.searchParams.get("entryId"))
    if (!entryId || Number.isNaN(entryId)) {
      return NextResponse.json({ error: "entryId is required" }, { status: 400 })
    }

    const db = getDb()

    const row = await db
      .select({
        id: queueEntries.id,
        businessId: queueEntries.businessId,
        createdAt: queueEntries.createdAt,
        status: queueEntries.status,
      })
      .from(queueEntries)
      .where(eq(queueEntries.id, entryId))
      .limit(1)

    if (!row[0]) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    const entry = row[0]

    // Calculate position
    const positionResult = await db
      .select({ count: count() })
      .from(queueEntries)
      .where(
        and(
          eq(queueEntries.businessId, entry.businessId),
          lte(queueEntries.createdAt, entry.createdAt)
        )
      )

    const position = positionResult[0]?.count || 0

    // Get average service time
    const businessResult = await db
      .select({ avgServiceTime: businesses.avgServiceTime })
      .from(businesses)
      .where(eq(businesses.id, entry.businessId))

    const minutesPerPerson = businessResult[0]?.avgServiceTime || 7
    const estimatedWait = Math.max(0, (position - 1) * minutesPerPerson)

    return NextResponse.json({
      position,
      estimatedWaitMinutes: estimatedWait,
      status: entry.status,
    })
  } catch (err: any) {
    console.error("[v0] GET /api/queue/status error:", err?.message)
    return NextResponse.json({ error: err?.message || "Failed to get status" }, { status: 500 })
  }
}
