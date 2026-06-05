import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { sendEmail } from "@/src/lib/mail";
import { sendTelegramNotification } from "@/src/lib/telegram";
import type { ApiResponse } from "@/src/types";

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const contact = await prisma.contact.create({
      data: validated,
    });

    // Send email to client if provided
    if (validated.email) {
      const emailHtml = `
        <h2>Спасибо за сообщение!</h2>
        <p>Мы получили ваше сообщение и свяжемся с вами в ближайшее время.</p>
        <p>ID запроса: ${contact.id}</p>
      `;
      await sendEmail(validated.email, "Мы получили ваше сообщение", emailHtml);
    }

    // Send notification to admin
    const adminMessage = `
      <b>Новое сообщение контакта!</b>
      Имя: ${validated.name}
      Телефон: ${validated.phone}
      Email: ${validated.email || "Не указан"}
      Сообщение: ${validated.message}
    `;
    await sendTelegramNotification(adminMessage);

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save contact",
      },
      { status: 400 },
    );
  }
}
