import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { sendEmail } from "@/src/lib/mail";
import { sendTelegramNotification } from "@/src/lib/telegram";
import type { ApiResponse } from "@/src/types";

const bookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  carModel: z.string(),
  year: z.number().int(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const validated = bookingSchema.parse(body);

    const booking = await prisma.booking.create({
      data: validated,
    });

    // Send email to client
    const clientEmailHtml = `
      <h2>Спасибо за вашу заявку!</h2>
      <p>Мы получили вашу заявку на ремонт батареи.</p>
      <p>Наша команда свяжется с вами в ближайшее время.</p>
      <p>ID заявки: ${booking.id}</p>
    `;
    await sendEmail(validated.email, "Подтверждение заявки", clientEmailHtml);

    // Send notification to admin
    const adminMessage = `
      <b>Новая заявка на ремонт батареи!</b>
      Имя: ${validated.name}
      Телефон: ${validated.phone}
      Email: ${validated.email}
      Модель: ${validated.carModel} (${validated.year})
      Сообщение: ${validated.message || "Нет"}
    `;
    await sendTelegramNotification(adminMessage);

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create booking",
      },
      { status: 400 },
    );
  }
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
      },
      { status: 500 },
    );
  }
}
