import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary } from "@/dictionaries";
import type { BookingState } from "../actions";

interface Props {
  dict: Dictionary["booking"];
  state: BookingState;
  isPending: boolean;
  onPrev: () => void;
}

export function BookingStepContact({ dict, state, isPending, onPrev }: Props) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">{dict.step3}</Typography>

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
        required
      />

      <TextField
        name="message"
        label={dict.message}
        multiline
        minRows={3}
        error={!!state.errors?.message}
        helperText={state.errors?.message?.[0]}
        fullWidth
      />

      {state.error && (
        <Typography color="error" variant="body2">
          {state.error}
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
