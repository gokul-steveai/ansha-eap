"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  image: string;
  link: string;
  date: Date; // date field
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createPublicEvent(
  data: Omit<PublicEvent, "id" | "created_at" | "updated_at">
): Promise<Result<PublicEvent>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO public_events
      (id, title, description, time, location, image, link, date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;
    const values = [
      id,
      data.title,
      data.description,
      data.time,
      data.location,
      data.image,
      data.link,
      data.date, // include date
    ];
    const result = await pool.query(query, values);
    return { success: true, message: "PublicEvent created successfully", data: result.rows[0] as PublicEvent };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
type GetPublicEventsParams = {
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "date" | "title";
  order?: "ASC" | "DESC";
  date?: string; // filter by date, optional
  title?: string; // filter by title, optional
};

export async function getPublicEvents(params: GetPublicEventsParams = {}): Promise<Result<PublicEvent[]>> {
  try {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    // Optional filters
    if (params.date) {
      conditions.push(`date = $${i++}`);
      values.push(params.date);
    }

    if (params.title) {
      conditions.push(`title ILIKE $${i++}`);
      values.push(`%${params.title}%`);
    }

    // Base query
    let query = `SELECT * FROM public_events`;

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
    return { success: true, message: "PublicEvents fetched successfully", data: result.rows as PublicEvent[] };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}


// READ ONE
export async function getPublicEventById(id: string): Promise<Result<PublicEvent>> {
  try {
    const result = await pool.query(`SELECT * FROM public_events WHERE id = $1`, [id]);
    if (!result.rows[0]) return { success: false, message: "PublicEvent not found" };
    return { success: true, message: "PublicEvent fetched successfully", data: result.rows[0] as PublicEvent };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

export async function getPublicEventByTitle(title: string): Promise<Result<PublicEvent>> {
  try {
    const result = await pool.query(`SELECT * FROM public_events WHERE title = $1`, [title]);
    if (!result.rows[0]) return { success: false, message: `PublicEvent: ${title} not found` };
    return { success: true, message: `PublicEvent: ${title} fetched successfully`, data: result.rows[0] as PublicEvent };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updatePublicEvent(
  id: string,
  data: Partial<Omit<PublicEvent, "id" | "created_at" | "updated_at">>
): Promise<Result<PublicEvent>> {
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
      UPDATE public_events
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0]) return { success: false, message: `PublicEvent: ${id} not found` };
    return { success: true, message: `PublicEvent: ${id} updated successfully`, data: result.rows[0] as PublicEvent };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deletePublicEvent(id: string): Promise<Result<PublicEvent>> {
  try {
    const result = await pool.query(`DELETE FROM public_events WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return { success: false, message: "PublicEvent not found" };
    return { success: true, message: `PublicEvent: ${id} deleted successfully`, data: result.rows[0] as PublicEvent };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
