"use server";
import pool from "@/lib/db";
import { ApiResponse, createErrorResponse, createSuccessResponse, DailyActivity, DailyCheckIn, ErrorResponse } from "@/types";
import { nanoid } from "nanoid";
import { Company } from "./crudCompanies";
import bcrypt from "bcrypt";
import { ERROR_CODES } from "@/types/errorCodes";

export type PatientIdObj = {
  account_id: string;
  patient_id: string;
};

export type User = {
  id: string;
  patient_id: PatientIdObj[];
  first_name: string;
  last_name: string;
  profile_img: string;
  email: string;
  phone: string;
  password: string;
  company: string;
  created_at: string;
  updated_at: string;
  roles: string[];
};

export type DashboardUser = {
  user: User;
  company_data: Company;
  daily_activities: DailyActivity[];
  daily_check_ins: DailyCheckIn[];
};

export async function getUserDashboardData(userId: string): Promise<ApiResponse<DashboardUser> | ErrorResponse> {
  try {
    const result = await pool.query(
      `
      SELECT 
        u.*, 
        -- fetch company as a JSON object
        (SELECT row_to_json(c)
         FROM companies c
         WHERE c.code = u.company
        ) AS company_data,
        COALESCE(json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL), '[]') AS daily_activities,
        COALESCE(json_agg(DISTINCT d.*) FILTER (WHERE d.id IS NOT NULL), '[]') AS daily_check_ins
      FROM users u
      LEFT JOIN daily_activities a ON a.user_id = u.id
      LEFT JOIN daily_check_ins d ON d.user_id = u.id
      WHERE u.id = $1
      GROUP BY u.id;
      `,
      [userId]
    );

    if (!result.rows[0]) {
      return createErrorResponse(`User: ${userId} not found`, ERROR_CODES.NOT_FOUND);
    }

    const row = result.rows[0];

    // map result into DashboardUser
    const dashboardData: DashboardUser = {
      user: {
        id: row.id,
        patient_id: row.patient_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone,
        password: row.password,
        company: row.company,
        profile_img: row.profile_img,
        created_at: row.created_at,
        updated_at: row.updated_at,
        roles: row.roles || [],
      },
      company_data: row.company_data,               // already a JSON object
      daily_activities: row.daily_activities || [], 
      daily_check_ins: row.daily_check_ins || [],
    };

    return createSuccessResponse(dashboardData, "Dashboard data fetched successfully");
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.DASHBOARD_DATA_FETCH_ERROR);
  }
}

// CREATE
export async function createUser(
  data: Omit<User, "id" | "patient_id" | "created_at" | "updated_at" | "roles" | "profile_img">
): Promise<ApiResponse<User> | ErrorResponse> {
  try {
    const id = nanoid(10);

    const query = `
      INSERT INTO users (id, email, phone, password, company, first_name, last_name, profile_img)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      id,
      data.email,
      data.phone,
      data.password,
      data.company ?? null,
      data.first_name ?? null,
      data.last_name ?? null,
      "/assets/images/default-avatar.png",
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0] as User;

    // ✅ Insert default "user" role
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, (SELECT id FROM roles WHERE name = 'user'))
       ON CONFLICT DO NOTHING;`,
      [user.id]
    );

    // fetch roles
    const rolesRes = await pool.query(
      `SELECT r.name FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1;`,
      [user.id]
    );

    user.roles = rolesRes.rows.map((r) => r.name);

    return createSuccessResponse(user, "User created successfully");
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_CREATION_FAILED);
  }
}

// READ ALL
export async function getUsers(): Promise<ApiResponse<User[]> | ErrorResponse> {
  try {
    const result = await pool.query(`
      SELECT u.*, COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id
      ORDER BY u.created_at DESC;
    `);

    return createSuccessResponse(result.rows as User[], "Users fetched successfully");
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_FETCH_FAILED);
  }
}

// READ ONE (by ID)
export async function getUserById(id: string): Promise<ApiResponse<User> | ErrorResponse> {
  try {
    const result = await pool.query(`
      SELECT u.*, COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      GROUP BY u.id;
    `, [id]);

    if (!result.rows[0]) {
      return createErrorResponse(`User: ${id} not found`, ERROR_CODES.USER_NOT_FOUND);
    }

    return createSuccessResponse(result.rows[0] as User, "User fetched successfully");
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_FETCH_FAILED);
  }
}

// READ ALL USERS BY COMPANY
export async function getUsersByCompany(companyId: string): Promise<ApiResponse<User[]> | ErrorResponse> {
  try {
    const result = await pool.query(
      `
      SELECT u.*, COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.company = $1
      GROUP BY u.id
      ORDER BY u.created_at DESC;
      `,
      [companyId]
    );

    return createSuccessResponse(result.rows as User[], "Users fetched successfully for company");
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_FETCH_FAILED);
  }
}


// READ ONE (by Email)
export async function getUserByEmail(email: string): Promise<ApiResponse<User> | ErrorResponse> {
  try {
    const result = await pool.query(`
      SELECT u.*, COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = $1
      GROUP BY u.id;
    `, [email]);

    if (!result.rows[0]) return createErrorResponse(`User: ${email} not found`, ERROR_CODES.USER_NOT_FOUND);

    return createSuccessResponse(result.rows[0] as User, "User fetched successfully");
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_FETCH_FAILED);
  }
}

// UPDATE
// export async function updateUser(
//   id: string,
//   data: Partial<Omit<User, "id" | "created_at">>
// ): Promise<Result<User>> {
//   try {
//     const fields = [];
//     const values = [];
//     let i = 1;

//     for (const [key, value] of Object.entries(data)) {
//       if (key === "id" || key === "created_at" || key === "updated_at" || key === "roles") continue;
//       fields.push(`${key} = $${i++}`);
//       values.push(value);
//     }

//     values.push(id);

//     const query = `
//       UPDATE users
//       SET ${fields.join(", ")}, updated_at = NOW()
//       WHERE id = $${i}
//       RETURNING *;
//     `;

//     const result = await pool.query(query, values);
//     if (!result.rows[0]) return { success: false, message: `User: ${id} not found` };

//     const user = result.rows[0] as User;

//     // ✅ If roles provided, update them
//     if (data.roles) {
//       await pool.query(`DELETE FROM user_roles WHERE user_id = $1`, [id]);

//       for (const role of data.roles) {
//         await pool.query(
//           `INSERT INTO user_roles (user_id, role_id)
//            VALUES ($1, (SELECT id FROM roles WHERE name = $2))
//            ON CONFLICT DO NOTHING;`,
//           [id, role]
//         );
//       }

//       const rolesRes = await pool.query(
//         `SELECT r.name FROM roles r
//          JOIN user_roles ur ON r.id = ur.role_id
//          WHERE ur.user_id = $1;`,
//         [id]
//       );

//       user.roles = rolesRes.rows.map((r) => r.name);
//     }

//     return {
//       success: true,
//       message: `User: ${id} updated successfully`,
//       data: user,
//     };
//   } catch (error: unknown) {
//     let message = "An unknown error occurred";
//     if (error instanceof Error) message = error.message;
//     return { success: false, message };
//   }
// }



export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "created_at">>
): Promise<ApiResponse<User> | ErrorResponse> {
  try {
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let i = 1;

    const currentUserRes = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    const currentUser = currentUserRes.rows[0] as User;

    for (const [key, value] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;

      if (key === "patient_id" && value) {
        const newPatientIds = value as PatientIdObj[];

        const merged: PatientIdObj[] = [
          ...(currentUser.patient_id ?? []),
          ...newPatientIds,
        ];

        fields.push(`${key} = $${i++}`);
        values.push(JSON.stringify(merged));
        continue;
      }

      if(key === 'password'){
        const hashedPassword = await bcrypt.hash(value as string, 10);
        fields.push(`${key} = $${i++}`);
        values.push(hashedPassword);
        continue;
      }


      fields.push(`${key} = $${i++}`);
      values.push(value as string | number | boolean | null);
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (!result.rows[0]) {
      return createErrorResponse(`User: ${id} not found`, ERROR_CODES.USER_NOT_FOUND);
    }

    const user = result.rows[0] as User;

    if (data.roles) {
      await pool.query(`DELETE FROM user_roles WHERE user_id = $1`, [id]);

      for (const role of data.roles) {
        await pool.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, (SELECT id FROM roles WHERE name = $2))
           ON CONFLICT DO NOTHING;`,
          [id, role]
        );
      }

      const rolesRes = await pool.query(
        `SELECT r.name FROM roles r
         JOIN user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = $1;`,
        [id]
      );

      user.roles = rolesRes.rows.map((r) => r.name);
    }

    return createSuccessResponse(user, `User: ${id} updated successfully`);
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_UPDATE_FAILED);
  }
}

export async function deleteUser(id: string): Promise<ApiResponse<User> | ErrorResponse> {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
    if (!result.rows[0]) return createErrorResponse(`User: ${id} not found`, ERROR_CODES.USER_NOT_FOUND);

    return createSuccessResponse(result.rows[0] as User, `User: ${id} deleted successfully`);
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;
    return createErrorResponse(message, ERROR_CODES.USER_DELETE_FAILED);
  }
}
