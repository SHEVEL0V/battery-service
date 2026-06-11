import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@g/prisma";
import { defaultLocale, type Locale } from "@/config/locales";
import routes from "@/lib/routing/routes";
import { decrypt } from "./session";

export interface VerifiedSession {
  isAuth: true;
  userId: string;
  role: Role;
}

export const verifySession = cache(
  async (locale: Locale = defaultLocale): Promise<VerifiedSession> => {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) redirect(routes(locale).login);

    return { isAuth: true, userId: session.userId, role: session.role };
  },
);
