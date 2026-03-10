"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";
import { Practitioner } from "./crudPractitioners";

export type Company = {
  id: string;
  code: string;
  name: string;
  logo_url: string | null;
  max_users: number;
  max_booking_credits_per_user: number;
  practitioners: string[];
  locations: string[];
  created_at: string;
  updated_at: string;
};


type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createCompany(
  data: Omit<Company, "id" | "created_at" | "updated_at">
): Promise<Result<Company>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO companies (id, code, name, logo_url, max_users, max_booking_credits_per_user, practitioners, locations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      id,
      data.code,
      data.name,
      data.logo_url ?? null,
      data.max_users ?? 10,
      data.max_booking_credits_per_user ?? 5,
      data.practitioners ?? [],
      data.practitioners ?? []
    ];

    const result = await pool.query(query, values);

    return {
      success: true,
      message: "Company created successfully",
      data: result.rows[0] as Company,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getCompanies(): Promise<Result<Company[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM companies ORDER BY created_at DESC;`
    );
    return {
      success: true,
      message: "Companies fetched successfully",
      data: result.rows as Company[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE (by ID)
export async function getCompanyById(id: string): Promise<Result<Company>> {
  try {
    const result = await pool.query(
      `SELECT * FROM companies WHERE id = $1;`,
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, message: `Company: ${id} not found` };
    }

    return {
      success: true,
      message: "Company fetched successfully",
      data: result.rows[0] as Company,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

export async function getCompanyByCode(code: string): Promise<Result<Company>> {
  try {
    const result = await pool.query(
      `SELECT * FROM companies WHERE code = $1;`,
      [code]
    );

    if (!result.rows[0]) {
      return { success: false, message: `Company: ${code} not found` };
    }

    return {
      success: true,
      message: "Company fetched successfully",
      data: result.rows[0] as Company,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updateCompany(
  id: string,
  data: Partial<Omit<Company, "id" | "created_at">>
): Promise<Result<Company>> {
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
      UPDATE companies
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0]) {
      return { success: false, message: `Company: ${id} not found` };
    }

    return {
      success: true,
      message: `Company: ${id} updated successfully`,
      data: result.rows[0] as Company,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

export async function getCompanyPractitioners(
  companyId: string
): Promise<Result<Practitioner[]>> {
  try {
    // 1. Fetch the company
    const companyRes = await pool.query(
      `SELECT * FROM companies WHERE id = $1;`,
      [companyId]
    );

    const company = companyRes.rows[0] as Company | undefined;
    if (!company) {
      return { success: false, message: `Company with id: ${companyId} not found` };
    }

    const practitionerIds = company.practitioners ?? [];
    if (practitionerIds.length === 0) {
      return { success: true, message: "No practitioners found", data: [] };
    }

    // 2. Fetch full practitioner details from practitioners table
    const practitionersRes = await pool.query(
      `SELECT * FROM practitioners WHERE id = ANY($1)`,
      [practitionerIds]
    );

    return {
      success: true,
      message: "Practitioners fetched successfully",
      data: practitionersRes.rows as Practitioner[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// DELETE
export async function deleteCompany(id: string): Promise<Result<Company>> {
  try {
    const result = await pool.query(
      `DELETE FROM companies WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (!result.rows[0]) {
      return { success: false, message: `Company: ${id} not found` };
    }

    return {
      success: true,
      message: `Company: ${id} deleted successfully`,
      data: result.rows[0] as Company,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
