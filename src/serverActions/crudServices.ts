"use server";

import pool from "@/lib/db";
import { nanoid } from "nanoid";


// CREATE TABLE services (
//   id TEXT PRIMARY KEY,
//   image_url TEXT,
//   service_name TEXT NOT NULL,
//   description TEXT,
//   booking_link TEXT,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

export type Service = {
  id: string;
  image_url: string | null;
  service_name: string;
  description: string;
  booking_link: string;
  created_at: string;
  updated_at: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createService(
  data: Omit<Service, "id" | "created_at" | "updated_at">
): Promise<Result<Service>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO services (id, image_url, service_name, description, booking_link)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [id, data.image_url, data.service_name, data.description, data.booking_link];

    const result = await pool.query(query, values);

    return {
      success: true,
      message: "Service created successfully",
      data: result.rows[0] as Service,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getServices(): Promise<Result<Service[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM services ORDER BY created_at DESC;`
    );
    return {
      success: true,
      message: "Services fetched successfully",
      data: result.rows as Service[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE
export async function getServiceById(id: string): Promise<Result<Service>> {
  try {
    const result = await pool.query(
      `SELECT * FROM services WHERE id = $1;`,
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, message: `Service: ${id} not found` };
    }

    return {
      success: true,
      message: "Service fetched successfully",
      data: result.rows[0] as Service,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id" | "created_at">>
): Promise<Result<Service>> {
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
      UPDATE services
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0]) {
      return { success: false, message: `Service: ${id} not found` };
    }

    return {
      success: true,
      message: `Service: ${id} updated successfully`,
      data: result.rows[0] as Service,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteService(id: string): Promise<Result<Service>> {
  try {
    const result = await pool.query(
      `DELETE FROM services WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, message: `Service: ${id} not found` };
    }

    return {
      success: true,
      message: `Service: ${id} deleted successfully`,
      data: result.rows[0] as Service,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
