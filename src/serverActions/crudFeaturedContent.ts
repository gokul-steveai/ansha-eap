"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type FeaturedContent = {
  id: string;
  ids: string[];      // array of post IDs
  type: string;       // e.g., "banner", "highlight"
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createFeaturedContent(
  data: Omit<FeaturedContent, "id" | "created_at" | "updated_at">
): Promise<Result<FeaturedContent>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO featured_content (id, ids, type)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [id, data.ids, data.type];

    const result = await pool.query(query, values);

    return {
      success: true,
      message: "Featured content created successfully",
      data: result.rows[0] as FeaturedContent,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getFeaturedContents(): Promise<Result<FeaturedContent[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM featured_content ORDER BY created_at DESC;`
    );
    return {
      success: true,
      message: "Featured content fetched successfully",
      data: result.rows as FeaturedContent[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE (by ID)
export async function getFeaturedContentById(id: string): Promise<Result<FeaturedContent>> {
  try {
    const result = await pool.query(
      `SELECT * FROM featured_content WHERE id = $1;`,
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, message: `FeaturedContent: ${id} not found` };
    }

    return {
      success: true,
      message: "Featured content fetched successfully",
      data: result.rows[0] as FeaturedContent,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updateFeaturedContent(
  id: string,
  data: Partial<Omit<FeaturedContent, "id" | "created_at">>
): Promise<Result<FeaturedContent>> {
  try {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }

    values.push(id);

    const query = `
      UPDATE featured_content
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0]) {
      return { success: false, message: `FeaturedContent: ${id} not found` };
    }

    return {
      success: true,
      message: `FeaturedContent: ${id} updated successfully`,
      data: result.rows[0] as FeaturedContent,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteFeaturedContent(id: string): Promise<Result<FeaturedContent>> {
  try {
    const result = await pool.query(
      `DELETE FROM featured_content WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, message: `FeaturedContent: ${id} not found` };
    }

    return {
      success: true,
      message: `FeaturedContent: ${id} deleted successfully`,
      data: result.rows[0] as FeaturedContent,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
