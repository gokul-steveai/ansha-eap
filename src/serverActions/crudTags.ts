"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type Tag = {
  id: string;
  name: string;
  created_at: Date;
};

type Result<T> = { success: boolean; message: string; data?: T };

// CREATE
export async function createTag(name: string): Promise<Result<Tag>> {
  try {
    const id = nanoid(10);
    const result = await pool.query(
      `INSERT INTO tags (id, name) VALUES ($1, $2) RETURNING *`,
      [id, name]
    );
    return { success: true, message: "Tag created", data: result.rows[0] };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getTags(): Promise<Result<Tag[]>> {
  try {
    const result = await pool.query(`SELECT * FROM tags ORDER BY name ASC`);
    return { success: true, message: "Tags fetched", data: result.rows };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteTag(id: string): Promise<Result<Tag>> {
  try {
    const result = await pool.query(`DELETE FROM tags WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: "Tag not found" };
    return { success: true, message: "Tag deleted", data: result.rows[0] };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
