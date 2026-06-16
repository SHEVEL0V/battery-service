"use client";

import { useActionState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary, Locale } from "@/i18n/config";
import { ACTION_ERROR } from "@/lib/actions/types";
import { login, type LoginState } from "../actions";

const initialState: LoginState = null;

interface Props {
  dict: Dictionary["auth"];
  errorsDict: Dictionary["errors"];
  lang: Locale;
}

export function LoginForm({ dict, errorsDict, lang }: Props) {
  const [state, action, isPending] = useActionState(login, initialState);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  const errorMessage =
    state && !state.ok && state.code !== "validation"
      ? state.code === ACTION_ERROR.invalidCredentials
        ? dict.invalidCredentials
        : errorsDict.serverError
      : undefined;

  return (
    <form action={action}>
      <Stack spacing={3}>
        <input type="hidden" name="lang" value={lang} />

        <TextField
          name="email"
          type="email"
          label={dict.email}
          error={!!fieldErrors?.email}
          helperText={fieldErrors?.email?.[0]}
          fullWidth
          required
        />

        <TextField
          name="password"
          type="password"
          label={dict.password}
          error={!!fieldErrors?.password}
          helperText={fieldErrors?.password?.[0]}
          fullWidth
          required
        />

        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}

        <Button type="submit" variant="contained" size="large" disabled={isPending}>
          {dict.submit}
        </Button>
      </Stack>
    </form>
  );
}
