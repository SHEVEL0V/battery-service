"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth/dal";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { BookingStatus } from "@/types";

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await verifySession();

  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  revalidateTag(CACHE_TAGS.bookings, "default");
}
