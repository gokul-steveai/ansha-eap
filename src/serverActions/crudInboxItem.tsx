"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";

// --------------------
// Types
// --------------------
export type Result<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type InboxItem = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  url?: string;
  item_type: "push" | "system_alert" | "system_message" | "appointment" | "reminder";
  status: "unread" | "read" | "archived" | "deleted";
  delivered_at?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
};

// --------------------
// CRUD functions
// --------------------

// CREATE

export type CreateInboxProps = {
 userId: string,
  title: string,
  body: string,
  url?: string,
  itemType: InboxItem["item_type"]
 
}
export async function createInboxItem(data:CreateInboxProps): Promise<Result<InboxItem>> {
  const id = nanoid();
  try {
    const query = `
      INSERT INTO inbox_items (id, user_id, title, body, url, item_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [id, data.userId, data.title, data.body, data.url ?? null, data.itemType || "push"];
    const result = await pool.query(query, values);
    return { success: true, message: "Inbox item created", data: result.rows[0] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// READ ALL
export async function getInboxItems(userId: string): Promise<Result<InboxItem[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM inbox_items WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return { success: true, message: "Inbox items fetched", data: result.rows };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// UPDATE - mark as read
export async function markInboxItemAsRead(itemId: string): Promise<Result<InboxItem>> {
  try {
    const result = await pool.query(
      `UPDATE inbox_items
       SET status = 'read', read_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [itemId]
    );
    if (!result.rows[0]) return { success: false, message: "Inbox item not found" };
    return { success: true, message: "Inbox item marked as read", data: result.rows[0] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// DELETE
export async function deleteInboxItem(itemId: string): Promise<Result<InboxItem>> {
  try {
    const result = await pool.query(
      `DELETE FROM inbox_items WHERE id = $1 RETURNING *`,
      [itemId]
    );
    if (!result.rows[0]) return { success: false, message: "Inbox item not found" };
    return { success: true, message: "Inbox item deleted", data: result.rows[0] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}
