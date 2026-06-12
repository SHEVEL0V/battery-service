import { Box, Container, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { ReviewsTable } from "@/features/admin/components/ReviewsTable";
import { getAllReviews } from "@/features/reviews/queries";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({ params }: PageProps<"/[lang]/admin/reviews">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const reviews = await getAllReviews();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          Reviews
        </Typography>
        <ReviewsTable reviews={reviews} />
      </Container>
    </Box>
  );
}
