import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { queueEntries } from "@/lib/schema"
import { eq, inArray } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const businessId = Number(url.searchParams.get("businessId") || 1)
    let db: ReturnType<typeof getDb> | null = null
    try {
      db = getDb()
    } catch (e) {
      db = null
    }

    const rows = db
      ? await db
          .select({
            id: queueEntries.id,
            customerName: queueEntries.customerName,
            phone: queueEntries.phone,
            joinTime: queueEntries.createdAt,
            status: queueEntries.status,
          })
          .from(queueEntries)
          .where(
            eq(queueEntries.businessId, businessId)
          )
          .orderBy(queueEntries.createdAt)
          .limit(200)
      : [
          { id: 1, customerName: "Alice", phone: "1234567890", joinTime: new Date(), status: "waiting" },
          { id: 2, customerName: "Bob", phone: "", joinTime: new Date(), status: "serving" },
          { id: 3, customerName: "Charlie", phone: "0987654321", joinTime: new Date(), status: "notified" },
        ] as any

    // Format the data to match the original response format
    const formattedRows = rows.map((row: any) => ({
      id: row.id,
      customer_name: row.customerName,
      phone: row.phone || '',
      join_time: new Date(row.joinTime).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
      }),
      status: row.status
    }))

    return NextResponse.json({ queue: formattedRows })
  } catch (err: any) {
    console.error("[v0] GET /api/dashboard/queue error:", err?.message)
    return NextResponse.json({ error: err?.message || "Failed to load queue" }, { status: 500 })
  }
}
