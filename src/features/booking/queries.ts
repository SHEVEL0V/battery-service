import "server-only";
import prisma from "@/lib/db/prisma";
import type { BookingStatus } from "@/types";

export const getBookings = (status?: BookingStatus) =>
  prisma.booking.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

export const countBookings = (status?: BookingStatus) =>
  prisma.booking.count({ where: status ? { status } : undefined });
