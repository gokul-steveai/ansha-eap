"use server";
import { nanoid } from "nanoid";
import pool from "@/lib/db";
import { DailyCheckIn, DailyCheckinQA } from "@/types";

export type CreateDailyCheckInParams = {
  user_id: string;
  responses: DailyCheckinQA[];
};

export async function createDailyCheckIn({
  user_id,
  responses,
}: CreateDailyCheckInParams): Promise<DailyCheckIn> {
  const id = nanoid(10);
  const query = `
      INSERT INTO daily_check_ins (id, user_id, responses)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
  const values = [id, user_id, JSON.stringify(responses)];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function getDailyCheckIns(userId: string):Promise<DailyCheckIn[]> {
  const query = `SELECT * FROM daily_check_ins WHERE user_id = $1 ORDER BY created_at DESC`;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}

export async function updateDailyCheckIn(
  id: string,
  responses: DailyCheckinQA[]
):Promise<DailyCheckIn>  {
  const query = `
      UPDATE daily_check_ins
      SET responses = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
  const values = [JSON.stringify(responses), id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function deleteDailyCheckIn(id: string) {
  const query = `DELETE FROM daily_check_ins WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}
