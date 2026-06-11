import { Box, Container, Paper, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/config";
import { LoginForm } from "@/features/auth/LoginForm";

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { auth } = await getDictionary(lang);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, display: "flex", justifyContent: "center" }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h2" sx={{ mb: 4, textAlign: "center" }}>
            {auth.login}
          </Typography>
          <LoginForm dict={auth} lang={lang} />
        </Paper>
      </Container>
    </Box>
  );
}
