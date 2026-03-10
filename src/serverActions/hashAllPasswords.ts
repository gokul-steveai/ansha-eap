"use server"
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function hashAllUserPasswords(): Promise<{ success: boolean; message: string }> {
  try {
    const client = await pool.connect();
    const saltRounds = 10;

    const res = await client.query("SELECT id, password FROM users");

    for (const user of res.rows) {
      const hashed = await bcrypt.hash(user.password, saltRounds);
      await client.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashed,
        user.id,
      ]);
      console.log(`Hashed password for user ${user.id}`);
    }

    client.release();
    return { success: true, message: "All user passwords hashed successfully" };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}