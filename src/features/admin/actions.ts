"use server";

import prisma from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import { mutate, mutateWith } from "@/lib/actions/mutate";
import type { ActionResult } from "@/lib/actions/types";
import type { BookingStatus } from "@/types";
import { serviceSchema, type ServiceInput } from "./schema";

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<ActionResult> {
  return mutate(() => prisma.booking.update({ where: { id }, data: { status } }), [CACHE_TAGS.bookings]);
}

export async function toggleReviewVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  return mutate(() => prisma.review.update({ where: { id }, data: { isVisible } }), [CACHE_TAGS.reviews]);
}

export async function deleteReview(id: string): Promise<ActionResult> {
  return mutate(() => prisma.review.delete({ where: { id } }), [CACHE_TAGS.reviews]);
}

export async function createService(input: ServiceInput): Promise<ActionResult<ServiceInput>> {
  return mutateWith(
    serviceSchema,
    input,
    (data) => prisma.service.create({ data }),
    [CACHE_TAGS.services],
  );
}

export async function updateService(id: string, input: ServiceInput): Promise<ActionResult<ServiceInput>> {
  return mutateWith(
    serviceSchema,
    input,
    (data) => prisma.service.update({ where: { id }, data }),
    [CACHE_TAGS.services],
  );
}
