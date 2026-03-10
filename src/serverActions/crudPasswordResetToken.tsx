"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type PasswordResetToken = {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE — generate reset token
export async function createPasswordResetToken(
  userId: string,
): Promise<Result<PasswordResetToken>> {
  try {
    const id = nanoid(10);
    const token = nanoid(50)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const query = `
      INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [id, userId, token, expiresAt];

    const result = await pool.query(query, values);

    return {
      success: true,
      message: "Password reset token created successfully",
      data: result.rows[0] as PasswordResetToken,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ — find token by raw token string (for reset page)
export async function getPasswordResetToken(
  token: string
): Promise<Result<PasswordResetToken>> {
  try {
    const result = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 LIMIT 1`,
      [token]
    );

    if (!result.rows[0])
      return { success: false, message: "Token not found" };

    return {
      success: true,
      message: "Token fetched successfully",
      data: result.rows[0] as PasswordResetToken,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ — find tokens by user (optional, admin/debug)
export async function getTokensByUser(
  userId: string
): Promise<Result<PasswordResetToken[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return {
      success: true,
      message: "Tokens fetched successfully",
      data: result.rows as PasswordResetToken[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE — mark token as used
export async function markTokenAsUsed(
  id: string
): Promise<Result<PasswordResetToken>> {
  try {
    const result = await pool.query(
      `
      UPDATE password_reset_tokens
      SET used = TRUE
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (!result.rows[0])
      return { success: false, message: `Token: ${id} not found` };

    return {
      success: true,
      message: "Token marked as used",
      data: result.rows[0] as PasswordResetToken,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE — delete a token (optional cleanup)
export async function deletePasswordResetToken(
  id: string
): Promise<Result<PasswordResetToken>> {
  try {
    const result = await pool.query(
      `DELETE FROM password_reset_tokens WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!result.rows[0])
      return { success: false, message: `Token: ${id} not found` };

    return {
      success: true,
      message: "Token deleted successfully",
      data: result.rows[0] as PasswordResetToken,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
