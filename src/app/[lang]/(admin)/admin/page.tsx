import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import NextLink from "@/components/ui/NextLink";
import routes from "@/lib/routing/routes";
import { getDictionary, hasLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { admin } = await getDictionary(lang);

  const [bookingsCount, pendingCount, servicesCount, pendingReviewsCount, contactsCount] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.review.count({ where: { isVisible: false } }),
      prisma.contact.count(),
    ]);

  const r = routes(lang);
  const stats = [
    { label: admin.dashboardStats.totalBookings, value: bookingsCount, href: r.adminBookings },
    { label: admin.dashboardStats.pendingBookings, value: pendingCount, href: `${r.adminBookings}?status=PENDING` },
    { label: admin.dashboardStats.activeServices, value: servicesCount, href: r.adminServices },
    { label: admin.dashboardStats.pendingReviews, value: pendingReviewsCount, href: r.adminReviews },
    { label: admin.dashboardStats.contactMessages, value: contactsCount, href: r.adminContacts },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          {admin.dashboard}
        </Typography>

        <Grid container spacing={3}>
          {stats.map(({ label, value, href }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
              <Paper
                component={NextLink}
                href={href}
                sx={{
                  p: 3,
                  textAlign: "center",
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.2s, transform 0.2s",
                  border: "1px solid transparent",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                  },
                }}
              >
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
