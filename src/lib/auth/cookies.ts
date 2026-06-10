import "server-only";

import { cookies } from "next/headers";
import { encrypt, decrypt } from "./session";
import type { SessionPayload } from "./session";

const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string, role: "ADMIN" | "SUPERADMIN") {
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
  const token = await encrypt({ userId, role, expiresAt });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export type { SessionPayload };
