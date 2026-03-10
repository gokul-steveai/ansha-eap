"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type UserActivity = {
  id: string;
  user_id: string;
  target_id: string; // e.g. "BLOG_ID" | "VIDEO_ID"
  target_type: string;   // e.g. "BLOG" | "VIDEO"
  action: string;        // e.g. "READ" | "WATCH"
  activity_date: string; // YYYY-MM-DD
  duration: number;
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE / UPSERT (accumulate duration if already exists today)
export async function upsertUserActivity(
  data: Omit<UserActivity, "id" | "created_at" | "updated_at" | "activity_date">
): Promise<Result<UserActivity>> {
  try {
    const id = nanoid();
    const query = `
      INSERT INTO user_activities 
        (id, user_id, target_id, target_type, action, duration, activity_date)
      VALUES 
        ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
      ON CONFLICT (user_id, target_id, action, activity_date)
      DO UPDATE SET 
        duration = user_activities.duration + EXCLUDED.duration,
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [id, data.user_id, data.target_id, data.target_type, data.action, data.duration];
    const result = await pool.query(query, values);
    return { success: true, message: "User activity recorded", data: result.rows[0] as UserActivity };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getUserActivities(): Promise<Result<UserActivity[]>> {
  try {
    const result = await pool.query(`SELECT * FROM user_activities ORDER BY created_at DESC`);
    return { success: true, message: "User activities fetched", data: result.rows as UserActivity[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE by ID
export async function getUserActivityById(id: string): Promise<Result<UserActivity>> {
  try {
    const result = await pool.query(`SELECT * FROM user_activities WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: "User activity not found" };
    return { success: true, message: "User activity fetched", data: result.rows[0] as UserActivity };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL by User
export async function getUserActivitiesByUser(userId: string): Promise<Result<UserActivity[]>> {
  try {
    const result = await pool.query(`SELECT * FROM user_activities WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    return { success: true, message: `Activities for user ${userId} fetched`, data: result.rows as UserActivity[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteUserActivity(id: string): Promise<Result<UserActivity>> {
  try {
    const result = await pool.query(`DELETE FROM user_activities WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: "User activity not found" };
    return { success: true, message: `User activity ${id} deleted`, data: result.rows[0] as UserActivity };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
