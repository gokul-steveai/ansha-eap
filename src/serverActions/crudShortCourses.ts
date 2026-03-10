"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type ShortCourse = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createShortCourse(
  data: Omit<ShortCourse, "id" | "created_at" | "updated_at">
): Promise<Result<ShortCourse>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO short_courses
      (id, title, description, image, link)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [
      id,
      data.title,
      data.description,
      data.image,
      data.link,
    ];
    const result = await pool.query(query, values);
    return { success: true, message: "ShortCourse created successfully", data: result.rows[0] as ShortCourse };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
type GetShortCoursesParams = {
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "date" | "title";
  order?: "ASC" | "DESC";
  date?: string; // filter by date, optional
  title?: string; // filter by title, optional
};

export async function getShortCourses(params: GetShortCoursesParams = {}): Promise<Result<ShortCourse[]>> {
  try {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    // Optional filters

    if (params.title) {
      conditions.push(`title ILIKE $${i++}`);
      values.push(`%${params.title}%`);
    }

    // Base query
    let query = `SELECT * FROM short_courses`;

    // Add WHERE if any conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Order by
    const orderBy = params.orderBy || "created_at";
    const order = params.order || "DESC";
    query += ` ORDER BY ${orderBy} ${order}`;

    // Pagination
    if (params.limit) {
      query += ` LIMIT $${i++}`;
      values.push(params.limit);
    }

    if (params.offset) {
      query += ` OFFSET $${i++}`;
      values.push(params.offset);
    }

    const result = await pool.query(query, values);
    return { success: true, message: "ShortCourses fetched successfully", data: result.rows as ShortCourse[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}


// READ ONE
export async function getShortCourseById(id: string): Promise<Result<ShortCourse>> {
  try {
    const result = await pool.query(`SELECT * FROM short_courses WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: "ShortCourses not found" };
    return { success: true, message: "ShortCourses fetched successfully", data: result.rows[0] as ShortCourse };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

export async function getShortCourseByTitle(title: string): Promise<Result<ShortCourse>> {
  try {
    const result = await pool.query(`SELECT * FROM short_courses WHERE title = $1`, [title]);
    if (!result.rows[0]) return { success: false, message: `ShortCourses: ${title} not found` };
    return { success: true, message: `ShortCourses: ${title} fetched successfully`, data: result.rows[0] as ShortCourse };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updateShortCourse(
  id: string,
  data: Partial<Omit<ShortCourse, "id" | "created_at">>
): Promise<Result<ShortCourse>> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }

    values.push(id);

    const query = `
      UPDATE short_courses
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0]) return { success: false, message: `ShortCourse: ${id} not found` };
    return { success: true, message: `ShortCourse: ${id} updated successfully`, data: result.rows[0] as ShortCourse };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteShortCourse(id: string): Promise<Result<ShortCourse>> {
  try {
    const result = await pool.query(`DELETE FROM short_courses WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: "ShortCourse not found" };
    return { success: true, message: `ShortCourse: ${id} deleted successfully`, data: result.rows[0] as ShortCourse };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
