import "server-only";

import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@g/prisma";

export interface SessionPayload {
  userId: string;
  role: Role;
  expiresAt: Date;
}

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const ALG = "HS256";

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: [ALG] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
