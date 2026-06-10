"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/db/prisma";
import { sendEmail } from "@/lib/integrations/mail";
import { sendTelegramNotification } from "@/lib/integrations/telegram";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import { bookingSchema } from "./schema";

export interface BookingState {
  success?: boolean;
  error?: string;
  errors?: Partial<Record<keyof z.infer<typeof bookingSchema>, string[]>>;
}

export async function createBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const validated = bookingSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    carModel: formData.get("carModel"),
    year: formData.get("year"),
    date: formData.get("date"),
    message: formData.get("message") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { date, ...bookingData } = validated.data;

  const booking = await prisma.booking.create({
    data: {
      ...bookingData,
      message: bookingData.message
        ? `${bookingData.message}\n\nБажана дата: ${date}`
        : `Бажана дата: ${date}`,
    },
  });

  const clientEmailHtml = `
    <h2>Дякуємо за вашу заявку!</h2>
    <p>Ми отримали вашу заявку на ремонт батареї.</p>
    <p>Наша команда зв'яжеться з вами найближчим часом.</p>
    <p>ID заявки: ${booking.id}</p>
  `;
  await sendEmail(validated.data.email, "Підтвердження заявки", clientEmailHtml);

  const adminMessage = `
    <b>Нова заявка на ремонт батареї!</b>
    Ім'я: ${validated.data.name}
    Телефон: ${validated.data.phone}
    Email: ${validated.data.email}
    Модель: ${validated.data.carModel} (${validated.data.year})
    Бажана дата: ${date}
    Повідомлення: ${validated.data.message ?? "Немає"}
  `;
  await sendTelegramNotification(adminMessage);

  revalidateTag(CACHE_TAGS.bookings, "default");

  return { success: true };
}
