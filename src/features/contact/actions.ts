"use server";

import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { sendEmail } from "@/lib/integrations/mail";
import { sendTelegramNotification } from "@/lib/integrations/telegram";
import { getDictionary, hasLocale, defaultLocale } from "@/i18n/config";
import { contactSchema } from "./schema";

export interface ContactState {
  success?: boolean;
  error?: string;
  errors?: Partial<Record<keyof z.infer<typeof contactSchema>, string[]>>;
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const lang = formData.get("lang");
  const locale = typeof lang === "string" && hasLocale(lang) ? lang : defaultLocale;

  const validated = contactSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  let contact;
  try {
    contact = await prisma.contact.create({ data: validated.data });
  } catch {
    const dict = await getDictionary(locale);
    return { error: dict.errors.serverError };
  }

  const adminMessage = `
    <b>Нове повідомлення контакту!</b>
    Ім'я: ${validated.data.name}
    Телефон: ${validated.data.phone}
    Email: ${validated.data.email ?? "Не вказано"}
    Повідомлення: ${validated.data.message}
  `;

  // Сповіщення некритичні для користувача — не блокують успіх звернення
  const notifications: Promise<unknown>[] = [sendTelegramNotification(adminMessage)];
  if (validated.data.email) {
    const emailHtml = `
      <h2>Дякую за ваше повідомлення!</h2>
      <p>Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.</p>
      <p>ID повідомлення: ${contact.id}</p>
    `;
    notifications.push(sendEmail(validated.data.email, "Дякую за ваше повідомлення", emailHtml));
  }
  await Promise.allSettled(notifications);

  return { success: true };
}
