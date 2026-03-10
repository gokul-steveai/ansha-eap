"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type Yoga = {
  id: string;
  title: string;
  slug: string;
  author: string;
  tags: string;
  video?: string;
  audio?: string;
  thumbnail?: string;
  duration_hours: number;
  duration_minutes: number;
  description?: string;
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createYoga(data: Omit<Yoga, "id" | "created_at" | "updated_at">): Promise<Result<Yoga>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO yogas
     (id, title, slug, author, tags, video, audio, thumbnail, description, duration_hours, duration_minutes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;
    const values = [
      id,
      data.title,
      data.slug,
      data.author,
      data.tags,
      data.video ?? null,
      data.audio ?? null,
      data.thumbnail ?? null,
      data.description ?? null,
      data.duration_hours,
      data.duration_minutes
    ];
    const result = await pool.query(query, values);
    return { success: true, message: "Yoga created successfully", data: result.rows[0] as Yoga };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getYogas(): Promise<Result<Yoga[]>> {
  try {
    const result = await pool.query(`SELECT * FROM yogas ORDER BY created_at DESC`);
    return { success: true, message: "Yogas fetched successfully", data: result.rows as Yoga[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE
export async function getYogaById(id: string): Promise<Result<Yoga>> {
  try {
    const result = await pool.query(`SELECT * FROM yogas WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: "Yoga not found" };
    return { success: true, message: "Yoga fetched successfully", data: result.rows[0] as Yoga };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
export async function getYogaByTitle(title: string): Promise<Result<Yoga>> {
  try {
    const result = await pool.query(`SELECT * FROM yogas WHERE title = $1`, [title]);

    if (!result.rows[0]) return { success: false, message: "Yoga not found" };

    return {
      success: true,
      message: "Yoga fetched successfully",
      data: result.rows[0] as Yoga
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}
export async function getYogaBySlug(slug: string): Promise<Result<Yoga>> {
  try {
    const result = await pool.query(`SELECT * FROM yogas WHERE slug = $1`, [slug]);

    if (!result.rows[0]) return { success: false, message: "Yoga not found" };

    return {
      success: true,
      message: "Yoga fetched successfully",
      data: result.rows[0] as Yoga
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}

// UPDATE
export async function updateYoga(id: string, data: Partial<Omit<Yoga, "id" | "created_at">>): Promise<Result<Yoga>> {
  try {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }

    values.push(id);

    const query = `
      UPDATE yogas
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0]) return { success: false, message: "Yoga not found" };
    return { success: true, message: "Yoga updated successfully", data: result.rows[0] as Yoga };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteYoga(id: string): Promise<Result<Yoga>> {
  try {
    const result = await pool.query(`DELETE FROM yogas WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: "Yoga not found" };
    return { success: true, message: "Yoga deleted successfully", data: result.rows[0] as Yoga };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
