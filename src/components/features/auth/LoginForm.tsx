"use client";

import { useActionState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary, Locale } from "@/dictionaries";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

interface Props {
  dict: Dictionary["auth"];
  lang: Locale;
}

export function LoginForm({ dict, lang }: Props) {
  const [state, action, isPending] = useActionState(login, initialState);

  return (
    <form action={action}>
      <Stack spacing={3}>
        <input type="hidden" name="lang" value={lang} />

        <TextField
          name="email"
          type="email"
          label={dict.email}
          error={!!state.errors?.email}
          helperText={state.errors?.email?.[0]}
          fullWidth
          required
        />

        <TextField
          name="password"
          type="password"
          label={dict.password}
          error={!!state.errors?.password}
          helperText={state.errors?.password?.[0]}
          fullWidth
          required
        />

        {state.message && (
          <Typography color="error" variant="body2">
            {state.message}
          </Typography>
        )}

        <Button type="submit" variant="contained" size="large" disabled={isPending}>
          {dict.submit}
        </Button>
      </Stack>
    </form>
  );
}
