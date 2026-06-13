import { Box, Container, Stack, Typography, Paper, Rating } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import type { Dictionary, Locale } from "@/i18n/config";
import { SectionBackgroundImage } from "@/components/ui/SectionBackgroundImage";
import { adaptiveOverlaySx, adaptiveOverlayVarsSx } from "@/lib/styles/sectionBackground";
import { getVisibleReviews } from "../queries";
import { AddReviewDialog } from "./AddReviewDialog";

interface Props {
  dict: Dictionary["reviews"];
  errorsDict: Dictionary["errors"];
  lang: Locale;
}

export async function ReviewsCarousel({ dict, errorsDict, lang }: Props) {
  const reviews = await getVisibleReviews(lang);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, ...adaptiveOverlayVarsSx }}>
      <SectionBackgroundImage src="/images/reviews.jpg" overlaySx={adaptiveOverlaySx} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <ScrollReveal direction="up">
          <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
            {dict.title}
          </Typography>
        </ScrollReveal>

        {reviews.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", mb: 6 }}>
            {dict.empty}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
              mb: 6,
            }}
          >
            {reviews.map((review, idx) => (
              <ScrollReveal key={review.id} direction="up" delay={idx * 0.1} style={{ height: "100%" }}>
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                  >
                    <Stack>
                      <Typography variant="h4">{review.author}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.carModel}
                      </Typography>
                    </Stack>
                    <Rating value={review.rating} readOnly size="small" />
                  </Stack>
                  <Typography variant="body2">{review.text}</Typography>
                </Paper>
              </ScrollReveal>
            ))}
          </Box>
        )}

        <ScrollReveal direction="up">
          <AddReviewDialog dict={dict} errorsDict={errorsDict} />
        </ScrollReveal>
      </Container>
    </Box>
  );
}
