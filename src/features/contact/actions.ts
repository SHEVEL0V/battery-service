"use server";

import prisma from "@/lib/db/prisma";
import { sendEmail } from "@/lib/integrations/mail";
import { sendTelegramNotification } from "@/lib/integrations/telegram";
import { formAction } from "@/lib/actions/formAction";
import type { ActionResult } from "@/lib/actions/types";
import { contactSchema, type ContactInput } from "./schema";

// null — форму ще не надсилали
export type ContactState = ActionResult<ContactInput> | null;

export const submitContact = formAction({
  schema: contactSchema,
  handler: async (data) => {
    const contact = await prisma.contact.create({ data });

    const adminMessage = `
      <b>Нове повідомлення контакту!</b>
      Ім'я: ${data.name}
      Телефон: ${data.phone}
      Email: ${data.email ?? "Не вказано"}
      Повідомлення: ${data.message}
    `;

    // Сповіщення некритичні для користувача — не блокують успіх звернення
    const notifications: Promise<unknown>[] = [sendTelegramNotification(adminMessage)];
    if (data.email) {
      const emailHtml = `
        <h2>Дякую за ваше повідомлення!</h2>
        <p>Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.</p>
        <p>ID повідомлення: ${contact.id}</p>
      `;
      notifications.push(sendEmail(data.email, "Дякую за ваше повідомлення", emailHtml));
    }
    await Promise.allSettled(notifications);
  },
});
