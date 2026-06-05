import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import type { ApiResponse } from "@/src/types";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch services",
      },
      { status: 500 },
    );
  }
}
