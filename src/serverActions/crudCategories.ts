"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type Category = {
  id: string;
  label: string;
  type: string;
  created_at: string;
  icon?: string;
  image_desktop?: string;
  image_mobile?: string;
};

type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createCategory(
  data: Omit<Category, "id" | "created_at">
): Promise<Result<Category>> {
  try {
    const id = nanoid(10);
    const query = `
  INSERT INTO categories (id, label, type, icon, image_desktop, image_mobile)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;
    const values = [
      id,
      data.label,
      data.type,
      data.icon ?? null,
      data.image_desktop ?? null,
      data.image_mobile ?? null,
    ];

    const result = await pool.query(query, values);

    return {
      success: true,
      message: "Category created successfully",
      data: result.rows[0] as Category,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getCategories(): Promise<Result<Category[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM categories ORDER BY created_at DESC`
    );
    return {
      success: true,
      message: "Category fetched successfully",
      data: result.rows as Category[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE (by ID)
export async function getCategoryById(id: string): Promise<Result<Category>> {
  try {
    const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [
      id,
    ]);
    if (!result.rows[0])
      return { success: false, message: "Category not found" };
    return {
      success: true,
      message: "Category fetched successfully",
      data: result.rows[0] as Category,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

export async function getCategoryByType(type: string): Promise<Result<Category[]>> {
  try {
    const result = await pool.query(`SELECT * FROM categories WHERE type = $1`, [
      type,
    ]);
    if (!result.rows[0])
      return { success: false, message: "Category not found" };
    return {
      success: true,
      message: "Category fetched successfully",
      data: result.rows,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
// READ ONE (by label)
export async function getCategoryByLabel(
  label: string
): Promise<Result<Category>> {
  try {
    const result = await pool.query(
      `SELECT * FROM categories WHERE label = $1`,
      [label]
    );
    if (!result.rows[0])
      return { success: false, message: `Category '${label}' not found` };
    return {
      success: true,
      message: `Category '${label}' fetched successfully`,
      data: result.rows[0] as Category,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id" | "created_at">>
): Promise<Result<Category>> {
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
      UPDATE categories
      SET ${fields.join(", ")}, created_at = created_at
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0])
      return { success: false, message: `Category '${id}' not found` };
    return {
      success: true,
      message: `Category '${id}' updated successfully`,
      data: result.rows[0] as Category,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteCategory(id: string): Promise<Result<Category>> {
  try {
    const result = await pool.query(
      `DELETE FROM categories WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows[0])
      return { success: false, message: "Category not found" };
    return {
      success: true,
      message: `Category '${id}' deleted successfully`,
      data: result.rows[0] as Category,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
