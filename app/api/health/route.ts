import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  const startTime = performance.now()
  
  try {
    // Check database connection
    const { data: dbCheck, error: dbError } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true })
    
    if (dbError) {
      throw new Error(`Database check failed: ${dbError.message}`)
    }

    // Check storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .listBuckets()

    const storageStatus = storageError ? "error" : "healthy"

    // Calculate response time
    const responseTime = Math.round(performance.now() - startTime)

    // Get active users (users who logged in within last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: activeUsers } = await supabase
      .from("action_logs")
      .select("*", { count: "exact", head: true })
      .eq("action_type", "login")
      .gte("created_at", oneDayAgo)

    return NextResponse.json({
      api: "healthy",
      database: "healthy",
      storage: storageStatus,
      responseTime,
      activeUsers: activeUsers || 0,
      dbSize: "N/A", // Would need database-specific query
      uptime: process.uptime ? `${Math.floor(process.uptime() / 86400)}d ${Math.floor((process.uptime() % 86400) / 3600)}h` : "N/A",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Health check failed:", error)
    
    return NextResponse.json({
      api: "error",
      database: "error",
      storage: "error",
      responseTime: Math.round(performance.now() - startTime),
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
