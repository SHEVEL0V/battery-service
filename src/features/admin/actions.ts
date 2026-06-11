"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/db/prisma";
import { verifySession } from "@/lib/auth/dal";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import type { BookingStatus } from "@/types";
import { serviceSchema, type ServiceInput } from "./schema";

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await verifySession();

  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  revalidateTag(CACHE_TAGS.bookings, "default");
}

export async function toggleReviewVisibility(id: string, isVisible: boolean) {
  await verifySession();

  await prisma.review.update({
    where: { id },
    data: { isVisible },
  });

  revalidateTag(CACHE_TAGS.reviews, "default");
}

export async function deleteReview(id: string) {
  await verifySession();

  await prisma.review.delete({ where: { id } });

  revalidateTag(CACHE_TAGS.reviews, "default");
}

export interface UpdateServiceState {
  success?: boolean;
  error?: string;
  errors?: Partial<Record<keyof ServiceInput, string[]>>;
}

export async function updateService(id: string, input: ServiceInput): Promise<UpdateServiceState> {
  await verifySession();

  const validated = serviceSchema.safeParse(input);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.service.update({
      where: { id },
      data: validated.data,
    });
  } catch {
    return { error: "Failed to update service. Slug may already be in use." };
  }

  revalidateTag(CACHE_TAGS.services, "default");
  return { success: true };
}
