"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";

export type Practitioner = {
  id: string;
  halaxy_id:string;
  first_name: string;
  last_name: string;
  email: string;
  profile_img?: string;
  description?: string;
  profession?: string;
  locations?: string[];
  clinic?: string;
  booking_link?: string;
  title?: string;

  expertise?: string[];
  languages?: string[];
  modalities?: string[];
  patient_focus?: string[];
  services?: string[];
  qualifications?: string[];
  accreditations?: string[];
  certifications?: string[];
  other_services?: string[];

  registrations: {name:string,value:string}[] | [];
  identifications?: {name:string,value:string}[] | [];

  created_at: string;
  updated_at: string;
};

export type Result<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// CREATE
export async function createPractitioner(
  data: Omit<Practitioner, "id" | "created_at" | "updated_at">
): Promise<Result<Practitioner>> {
  try {
    const id = nanoid(10);
    const query = `
      INSERT INTO practitioners
      (id, halaxy_id, first_name, last_name, email, profile_img, description, profession, locations, clinic, booking_link, title,
       expertise, languages, modalities, patient_focus, services, qualifications, accreditations, certifications, other_services,
       registrations, identifications)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
              $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
      RETURNING *;
    `;
    const values = [
      id,
      data.halaxy_id,
      data.first_name,
      data.last_name,
      data.email,
      data.profile_img ?? null,
      data.description ?? null,
      data.profession ?? null,
      data.locations ?? [],
      data.clinic ?? null,
      data.booking_link ?? null,
      data.title ?? null,

      data.expertise ?? [],
      data.languages ?? [],
      data.modalities ?? [],
      data.patient_focus ?? [],
      data.services ?? [],
      data.qualifications ?? [],
      data.accreditations ?? [],
      data.certifications ?? [],
      data.other_services ?? [],

      JSON.stringify(data.registrations || []),
      JSON.stringify(data.identifications || []),
    ];

    const result = await pool.query(query, values);
    return {
      success: true,
      message: "Practitioner created successfully",
      data: result.rows[0] as Practitioner,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// UPDATE
export async function updatePractitioner(
  id: string,
  data: Partial<Omit<Practitioner, "id" | "created_at | updated_at">>
): Promise<Result<Practitioner>> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      // JSON fields
       if (key === "id" || key === "created_at" || key === "updated_at") continue;
      if (key === "registrations" || key === "identifications") {
        fields.push(`${key} = $${i++}`);
        values.push(JSON.stringify(value ?? []));
      } else {
        fields.push(`${key} = $${i++}`);
        values.push(value);
      }
    }

    values.push(id);

    const query = `
      UPDATE practitioners
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (!result.rows[0])
      return { success: false, message: `Practitioner: ${id} not found` };
    return {
      success: true,
      message: `Practitioner: ${id} updated successfully`,
      data: result.rows[0] as Practitioner,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ALL
export async function getPractitioners(): Promise<Result<Practitioner[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM practitioners ORDER BY created_at DESC`
    );
    return {
      success: true,
      message: "Practitioners fetched successfully",
      data: result.rows as Practitioner[],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}

// READ ONE
export async function getPractitionerById(
  id: string
): Promise<Result<Practitioner>> {
  try {
    const result = await pool.query(
      `SELECT * FROM practitioners WHERE id = $1`,
      [id]
    );
    if (!result.rows[0])
      return { success: false, message: "Practitioner not found" };
    return {
      success: true,
      message: "Practitioner fetched successfully",
      data: result.rows[0] as Practitioner,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
export async function getPractitionerByHalaxyId(
  halaxy_id: string
): Promise<Result<Practitioner>> {
  try {
    const result = await pool.query(
      `SELECT * FROM practitioners WHERE halaxy_id = $1`,
      [halaxy_id]
    );
    if (!result.rows[0])
      return { success: false, message: "Practitioner not found" };
    return {
      success: true,
      message: "Practitioner fetched successfully",
      data: result.rows[0] as Practitioner,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}


// DELETE
export async function deletePractitioner(
  id: string
): Promise<Result<Practitioner>> {
  try {
    const result = await pool.query(
      `DELETE FROM practitioners WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows[0])
      return { success: false, message: "Practitioner not found" };
    return {
      success: true,
      message: `Practitioner: ${id} deleted successfully`,
      data: result.rows[0] as Practitioner,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return { success: false, message };
  }
}
