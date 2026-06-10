import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [bookingsCount, pendingCount, servicesCount, contactsCount] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.contact.count(),
  ]);

  const stats = [
    { label: "Total bookings", value: bookingsCount },
    { label: "Pending bookings", value: pendingCount },
    { label: "Active services", value: servicesCount },
    { label: "Contact messages", value: contactsCount },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          {stats.map(({ label, value }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h3" color="primary">
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
