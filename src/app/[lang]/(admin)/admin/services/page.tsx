import { Box, Container, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/config";
import { ServicesTable } from "@/features/admin/components/ServicesTable";
import { getAllServices } from "@/features/services/queries";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage({ params }: PageProps<"/[lang]/admin/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [{ admin }, services] = await Promise.all([
    getDictionary(lang),
    getAllServices(),
  ]);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          {admin.services}
        </Typography>
        <ServicesTable services={services} saveErrorText={admin.serviceSaveError} />
      </Container>
    </Box>
  );
}
