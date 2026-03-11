import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      console.error("[API last-seen] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API last-seen] Internal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
