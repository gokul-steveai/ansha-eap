"use server";
import { nanoid } from "nanoid";
import pool from "@/lib/db";

export async function createDailyActivity({
  user_id,
  reading_minutes = 0,
  video_minutes = 0,
  writing_minutes = 0,
  task_minutes = 0,
}: {
  user_id: string;
  reading_minutes?: number;
  video_minutes?: number;
  writing_minutes?: number;
  task_minutes?: number;
}) {
  const id = nanoid(10);
  const query = `
    INSERT INTO daily_activities (
      id, user_id, reading_minutes, video_minutes, writing_minutes, task_minutes
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [id, user_id, reading_minutes, video_minutes, writing_minutes, task_minutes];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function getDailyActivities(userId: string) {
  const query = `SELECT * FROM daily_activities WHERE user_id = $1 ORDER BY created_at DESC`;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}

export async function updateDailyActivity(id: string, updates: Partial<Omit<Parameters<typeof createDailyActivity>[0], "user_id">>) {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (key === "id" || key === "created_at" || key === "updated_at") continue;
    fields.push(`${key} = $${i++}`);
    values.push(value);
  }

  values.push(id);

  const query = `
    UPDATE daily_activities
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${i}
    RETURNING *;
  `;
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function deleteDailyActivity(id: string) {
  const query = `DELETE FROM daily_activities WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}
