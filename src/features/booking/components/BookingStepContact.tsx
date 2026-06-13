import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary } from "@/i18n/config";
import type { FieldErrors } from "@/lib/actions/types";
import type { BookingInput } from "../schema";

interface Props {
  dict: Dictionary["booking"];
  fieldErrors?: FieldErrors<BookingInput>;
  errorMessage?: string;
  isPending: boolean;
  onPrev: () => void;
}

export function BookingStepContact({ dict, fieldErrors, errorMessage, isPending, onPrev }: Props) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">{dict.step3}</Typography>

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
        required
      />

      <TextField
        name="message"
        label={dict.message}
        multiline
        minRows={3}
        error={!!fieldErrors?.message}
        helperText={fieldErrors?.message?.[0]}
        fullWidth
      />

      {errorMessage && (
        <Typography color="error" variant="body2">
          {errorMessage}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="button" variant="outlined" onClick={onPrev} disabled={isPending}>
          {dict.prev}
        </Button>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? dict.submitting : dict.submit}
        </Button>
      </Box>
    </Stack>
  );
}
