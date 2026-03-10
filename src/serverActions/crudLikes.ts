"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type Like = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE (Like a post)
export async function createLike(user_id: string, post_id: string): Promise<Result<Like>> {
  try {
    const id = nanoid(10);

    const query = `
      INSERT INTO likes (id, user_id, post_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING *;
    `;

    const values = [id, user_id, post_id];
    const result = await pool.query(query, values);

    if (!result.rows[0]) {
      return { success: false, message: "User already liked this post" };
    }

    return { success: true, message: "Post liked successfully", data: result.rows[0] as Like };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL (Get all likes)
export async function getLikes(): Promise<Result<Like[]>> {
  try {
    const result = await pool.query(`SELECT * FROM likes ORDER BY created_at DESC`);
    return { success: true, message: "Likes fetched successfully", data: result.rows as Like[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ BY USER
export async function getLikesByUser(user_id: string): Promise<Result<Like[]>> {
  try {
    const result = await pool.query(`SELECT * FROM likes WHERE user_id = $1 ORDER BY created_at DESC`, [user_id]);
    return { success: true, message: "User likes fetched successfully", data: result.rows as Like[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ BY POST
export async function getLikesByPost(post_id: string): Promise<Result<Like[]>> {
  try {
    const result = await pool.query(`SELECT * FROM likes WHERE post_id = $1 ORDER BY created_at DESC`, [post_id]);
    return { success: true, message: "Post likes fetched successfully", data: result.rows as Like[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// CHECK IF USER LIKED A POST
export async function checkIfUserLiked(user_id: string, post_id: string): Promise<Result<boolean>> {
  try {
    const result = await pool.query(
      `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2 LIMIT 1`,
      [user_id, post_id]
    );
    const liked = !!result.rows[0];
    return { success: true, message: "Like check completed", data: liked };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE (Unlike a post)
export async function deleteLike(user_id: string, post_id: string): Promise<Result<Like>> {
  try {
    const result = await pool.query(
      `DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING *`,
      [user_id, post_id]
    );

    if (!result.rows[0]) return { success: false, message: "Like not found" };

    return { success: true, message: "Like removed successfully", data: result.rows[0] as Like };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
