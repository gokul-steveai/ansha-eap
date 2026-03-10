import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // your PostgreSQL pool

export async function GET(req: NextRequest) {
  try {
    console.log(req)
    // Simple query to test DB connectivity
    const result = await pool.query(`SELECT NOW() AS now`);

    console.log("DB test result:", result.rows[0]);

    return NextResponse.json({
      success: true,
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("DB connection error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
