"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { sendTelegramNotification } from "@/lib/telegram";
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
  const validated = contactSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const contact = await prisma.contact.create({ data: validated.data });

  if (validated.data.email) {
    const emailHtml = `
      <h2>Дякую за ваше повідомлення!</h2>
      <p>Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.</p>
      <p>ID повідомлення: ${contact.id}</p>
    `;
    await sendEmail(validated.data.email, "Дякую за ваше повідомлення", emailHtml);
  }

  const adminMessage = `
    <b>Нове повідомлення контакту!</b>
    Ім'я: ${validated.data.name}
    Телефон: ${validated.data.phone}
    Email: ${validated.data.email ?? "Не вказано"}
    Повідомлення: ${validated.data.message}
  `;
  await sendTelegramNotification(adminMessage);

  return { success: true };
}
