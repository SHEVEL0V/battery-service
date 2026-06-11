"use client";

import { useActionState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary } from "@/i18n/config";
import { submitContact, type ContactState } from "./actions";
import { BookingSuccess } from "@/features/booking/components/BookingSuccess";

const initialState: ContactState = {};

interface Props {
  dict: Dictionary["contacts"]["form"];
}

export function ContactForm({ dict }: Props) {
  const [state, action, isPending] = useActionState(submitContact, initialState);

  if (state.success) {
    return <BookingSuccess dict={{ success: dict.success }} />;
  }

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <form action={action}>
        <Stack spacing={3}>
          <TextField
            name="name"
            label={dict.name}
            error={!!state.errors?.name}
            helperText={state.errors?.name?.[0]}
            fullWidth
            required
          />

          <TextField
            name="phone"
            label={dict.phone}
            error={!!state.errors?.phone}
            helperText={state.errors?.phone?.[0]}
            fullWidth
            required
          />

          <TextField
            name="email"
            type="email"
            label={dict.email}
            error={!!state.errors?.email}
            helperText={state.errors?.email?.[0]}
            fullWidth
          />

          <TextField
            name="message"
            label={dict.message}
            multiline
            minRows={3}
            error={!!state.errors?.message}
            helperText={state.errors?.message?.[0]}
            fullWidth
            required
          />

          {state.error && (
            <Typography color="error" variant="body2">
              {state.error}
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
