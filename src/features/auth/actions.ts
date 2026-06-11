"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { createSession, deleteSession } from "@/lib/auth/cookies";
import { hasLocale, defaultLocale } from "@/i18n/config";
import { loginSchema } from "./schema";

export interface LoginState {
  errors?: { email?: string[]; password?: string[] };
  message?: string;
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { email: validated.data.email },
  });

  if (!user) {
    return { message: "Невірний email або пароль" };
  }

  const passwordMatch = await bcrypt.compare(validated.data.password, user.password);
  if (!passwordMatch) {
    return { message: "Невірний email або пароль" };
  }

  await createSession(user.id, user.role);

  const lang = formData.get("lang");
  const locale = typeof lang === "string" && hasLocale(lang) ? lang : defaultLocale;
  redirect(`/${locale}/admin`);
}

export async function logout(formData: FormData): Promise<void> {
  await deleteSession();

  const lang = formData.get("lang");
  const locale = typeof lang === "string" && hasLocale(lang) ? lang : defaultLocale;
  redirect(`/${locale}/login`);
}
