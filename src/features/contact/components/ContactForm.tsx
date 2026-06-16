"use client";

import { useActionState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary, Locale } from "@/i18n/config";
import { submitContact, type ContactState } from "../actions";
import { SuccessState } from "@/components/ui/SuccessState";

const initialState: ContactState = null;

interface Props {
  dict: Dictionary["contacts"]["form"];
  errorsDict: Dictionary["errors"];
  lang: Locale;
}

export function ContactForm({ dict, errorsDict, lang }: Props) {
  const [state, action, isPending] = useActionState(submitContact, initialState);

  if (state?.ok) {
    return <SuccessState message={dict.success} />;
  }

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const showServerError = state && !state.ok && state.code !== "validation";

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <form action={action}>
        <input type="hidden" name="lang" value={lang} />
        <Stack spacing={3}>
          <TextField
            name="name"
            label={dict.name}
            error={!!fieldErrors?.name}
            helperText={fieldErrors?.name?.[0]}
            fullWidth
            required
          />

          <TextField
            name="phone"
            label={dict.phone}
            error={!!fieldErrors?.phone}
            helperText={fieldErrors?.phone?.[0]}
            fullWidth
            required
          />

          <TextField
            name="email"
            type="email"
            label={dict.email}
            error={!!fieldErrors?.email}
            helperText={fieldErrors?.email?.[0]}
            fullWidth
          />

          <TextField
            name="message"
            label={dict.message}
            multiline
            minRows={3}
            error={!!fieldErrors?.message}
            helperText={fieldErrors?.message?.[0]}
            fullWidth
            required
          />

          {showServerError && (
            <Typography color="error" variant="body2">
              {errorsDict.serverError}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" size="large" disabled={isPending}>
              {isPending ? dict.submitting : dict.submit}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}
