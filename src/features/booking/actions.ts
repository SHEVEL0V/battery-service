"use server";

import prisma from "@/lib/db/prisma";
import { sendEmail } from "@/lib/integrations/mail";
import { sendTelegramNotification } from "@/lib/integrations/telegram";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import { formAction } from "@/lib/actions/formAction";
import type { ActionResult } from "@/lib/actions/types";
import { bookingSchema, type BookingInput } from "./schema";

// null — форму ще не надсилали
export type BookingState = ActionResult<BookingInput> | null;

export const createBooking = formAction({
  schema: bookingSchema,
  revalidate: [CACHE_TAGS.bookings],
  handler: async ({ date, ...data }) => {
    const booking = await prisma.booking.create({
      data: { ...data, preferredDate: new Date(date) },
    });

    const clientEmailHtml = `
      <h2>Дякуємо за вашу заявку!</h2>
      <p>Ми отримали вашу заявку на ремонт батареї.</p>
      <p>Наша команда зв'яжеться з вами найближчим часом.</p>
      <p>ID заявки: ${booking.id}</p>
    `;
    const adminMessage = `
      <b>Нова заявка на ремонт батареї!</b>
      Ім'я: ${data.name}
      Телефон: ${data.phone}
      Email: ${data.email}
      Модель: ${data.carModel} (${data.year})
      Бажана дата: ${date}
      Повідомлення: ${data.message ?? "Немає"}
    `;

    // Сповіщення некритичні для користувача — не блокують успіх запису
    await Promise.allSettled([
      sendEmail(data.email, "Підтвердження заявки", clientEmailHtml),
      sendTelegramNotification(adminMessage),
    ]);
  },
});
