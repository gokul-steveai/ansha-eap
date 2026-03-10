"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type WHO5Response = {
  id: string;
  user_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  raw_score: number;
  percentage_score: number;
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createWHO5Response(data: {
  user_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
}): Promise<Result<WHO5Response>> {
  try {
    const id = nanoid(10);

    const query = `
      INSERT INTO who5_responses (id, user_id, q1, q2, q3, q4, q5)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [id, data.user_id, data.q1, data.q2, data.q3, data.q4, data.q5];

    const result = await pool.query(query, values);

    return { success: true, message: "WHO-5 response saved", data: result.rows[0] as WHO5Response };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL responses for a user
export async function getWHO5ResponsesByUser(user_id: string): Promise<Result<WHO5Response>> {
  try {
    const result = await pool.query(`SELECT * FROM who5_responses WHERE user_id = $1 ORDER BY created_at DESC`, [user_id]);
    return { success: true, message: "Responses fetched", data: result.rows[0] as WHO5Response };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
