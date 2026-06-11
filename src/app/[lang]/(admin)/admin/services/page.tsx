import { Box, Container, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { hasLocale } from "@/i18n/config";
import { ServicesTable } from "@/features/admin/components/ServicesTable";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage({ params }: PageProps<"/[lang]/admin/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          Services
        </Typography>
        <ServicesTable services={services} />
      </Container>
    </Box>
  );
}
