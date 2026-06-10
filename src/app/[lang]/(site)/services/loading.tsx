import { Box, Container, Grid, Skeleton, Stack } from "@mui/material";

export default function ServicesLoading() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack sx={{ gap: 6 }}>
          <Stack sx={{ alignItems: "center", gap: 1 }}>
            <Skeleton variant="text" width={240} height={56} />
            <Skeleton variant="text" width={360} height={28} />
          </Stack>

          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Skeleton variant="rounded" height={260} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
