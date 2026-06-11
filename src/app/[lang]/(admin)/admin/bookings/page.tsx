import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import NextLink from "@/components/ui/NextLink";
import routes from "@/lib/routing/routes";
import { hasLocale } from "@/i18n/config";
import { BookingsTable } from "@/features/admin/components/BookingsTable";
import type { BookingStatus } from "@/types";

export const dynamic = "force-dynamic";

const STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default async function AdminBookingsPage({
  params,
  searchParams,
}: PageProps<"/[lang]/admin/bookings">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { status } = await searchParams;
  const statusFilter = STATUSES.includes(status as BookingStatus)
    ? (status as BookingStatus)
    : undefined;

  const bookings = await prisma.booking.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ alignItems: "center", gap: 2, mb: 4 }}>
          <Typography variant="h2">Bookings</Typography>
          {statusFilter && (
            <Chip
              label={`Status: ${statusFilter} ✕`}
              component={NextLink}
              href={routes(lang).adminBookings}
              clickable
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
        <BookingsTable bookings={bookings} />
      </Container>
    </Box>
  );
}
