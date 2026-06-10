import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";

export interface VerifiedSession {
  isAuth: true;
  userId: string;
  role: "ADMIN" | "SUPERADMIN";
}

export const verifySession = cache(async (): Promise<VerifiedSession> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) redirect("/uk/login");

  return { isAuth: true, userId: session.userId, role: session.role };
});
