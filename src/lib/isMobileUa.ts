// lib/isMobileUA.ts
import { headers } from "next/headers";

export async function isMobileUA() {
  const h = await headers(); // 👈 await here
  const ua = h.get("user-agent") || "";
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}
