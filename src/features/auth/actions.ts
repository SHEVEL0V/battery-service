"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { createSession, deleteSession } from "@/lib/auth/cookies";
import { localeFromFormData } from "@/i18n/config";
import { formAction } from "@/lib/actions/formAction";
import { ACTION_ERROR, fail, type ActionResult } from "@/lib/actions/types";
import { loginSchema, type LoginInput } from "./schema";

// null — форму ще не надсилали
export type LoginState = ActionResult<LoginInput> | null;

export const login = formAction({
  schema: loginSchema,
  handler: async (data, formData) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return fail(ACTION_ERROR.invalidCredentials);

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) return fail(ACTION_ERROR.invalidCredentials);

    await createSession(user.id, user.role);

    redirect(`/${localeFromFormData(formData)}/admin`);
  },
});

export async function logout(formData: FormData): Promise<void> {
  await deleteSession();

  redirect(`/${localeFromFormData(formData)}/login`);
}
