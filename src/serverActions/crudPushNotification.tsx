"use server";
import pool from "@/lib/db";
import { nanoid } from "nanoid";
import { PushSubscription as WebPushSubscription } from "web-push";

// --------------------
// Types
// --------------------
export type Result<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type PushSubscriptionItem = {
  id: string;
  user_id: string;
  subscription: WebPushSubscription;
  created_at: string;
  updated_at: string;
};

// --------------------
// CRUD functions
// --------------------

// CREATE or UPDATE (upsert)
export async function createPushSubscription(
  userId: string,
  subscription: WebPushSubscription
): Promise<Result<PushSubscriptionItem>> {
  const id = nanoid(10); // unique id for this subscription

  try {
    const query = `
      INSERT INTO push_subscriptions (id, user_id, subscription)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [id, userId, subscription];
    const result = await pool.query(query, values);

    return { success: true, message: "Subscription saved", data: result.rows[0] };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


// READ by user
export async function getPushSubscription(userId: string): Promise<Result<PushSubscriptionItem>> {
  try {
    const result = await pool.query(
      `SELECT * FROM push_subscriptions WHERE user_id = $1`,
      [userId]
    );
    if (!result.rows[0]) return { success: false, message: "No subscription found" };
    return { success: true, message: "Subscription fetched", data: result.rows[0] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// DELETE by user
export async function deletePushSubscription(userId: string): Promise<Result<PushSubscriptionItem>> {
  try {
    const result = await pool.query(
      `DELETE FROM push_subscriptions WHERE user_id = $1 RETURNING *`,
      [userId]
    );
    if (!result.rows[0]) return { success: false, message: "No subscription found" };
    return { success: true, message: "Subscription deleted", data: result.rows[0] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// READ ALL (optional)
export async function getAllPushSubscriptions(): Promise<Result<PushSubscriptionItem[]>> {
  try {
    const result = await pool.query(`SELECT * FROM push_subscriptions`);
    return { success: true, message: "All subscriptions fetched", data: result.rows };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}


// GET subscription by userId
export async function getPushSubscriptionByClientId(
  userId: string
): Promise<Result<PushSubscriptionItem[]>> {
  try {
    const result = await pool.query(
      `SELECT * FROM push_subscriptions WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "No subscriptions found for client", data: [] };
    }

    return { success: true, message: "Subscriptions fetched", data: result.rows };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}

