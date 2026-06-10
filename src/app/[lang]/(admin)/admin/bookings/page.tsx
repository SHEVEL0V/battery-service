import { Box, Container, Typography } from "@mui/material";
import prisma from "@/lib/prisma";
import { BookingsTable } from "@/components/features/admin/BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          Bookings
        </Typography>
        <BookingsTable bookings={bookings} />
      </Container>
    </Box>
  );
}
