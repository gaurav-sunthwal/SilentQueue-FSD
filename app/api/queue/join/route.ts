import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { queueEntries, businesses } from "@/lib/schema"
import { eq, and, lte, count } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const businessId = Number(body?.businessId)
    const customerName = (body?.name || "Guest") as string
    const phone = (body?.phone || null) as string | null

    if (!businessId || Number.isNaN(businessId)) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 })
    }

    const db = getDb()

    // Insert queue entry with status waiting
    const [entry] = await db
      .insert(queueEntries)
      .values({
        businessId,
        customerName,
        phone,
        status: 'waiting'
      })
      .returning({
        id: queueEntries.id,
        businessId: queueEntries.businessId,
        createdAt: queueEntries.createdAt
      })

    // Compute position and estimated wait
    const positionResult = await db
      .select({ count: count() })
      .from(queueEntries)
      .where(
        and(
          eq(queueEntries.businessId, businessId),
          lte(queueEntries.createdAt, entry.createdAt)
        )
      )

    const position = positionResult[0]?.count || 0

    // Get average service time
    const businessResult = await db
      .select({ avgServiceTime: businesses.avgServiceTime })
      .from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1)

    const minutesPerPerson = businessResult[0]?.avgServiceTime || 7
    const estimatedWait = Math.max(0, (position - 1) * minutesPerPerson)

    return NextResponse.json({
      entryId: entry.id,
      position,
      estimatedWaitMinutes: estimatedWait,
    })
  } catch (err: any) {
    console.error("[v0] POST /api/queue/join error:", err?.message)
    return NextResponse.json({ error: err?.message || "Failed to join queue" }, { status: 500 })
  }
}
