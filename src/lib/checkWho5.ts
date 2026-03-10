// lib/checkWho5.ts
import pool from "@/lib/db";

export async function checkWho5Completed(user_id: string): Promise<boolean> {
  try {
    const result = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM who5_responses WHERE user_id = $1)",
      [user_id]
    );
    return result.rows[0].exists;
  } catch (err) {
    console.error("checkWho5Completed error:", err);
    return false;
  }
}
