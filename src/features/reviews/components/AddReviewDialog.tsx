"use client";

import { useActionState, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Dictionary } from "@/i18n/config";
import { submitReview, type ReviewState } from "../actions";
import { BookingSuccess } from "@/features/booking/components/BookingSuccess";

const initialState: ReviewState = null;

interface Props {
  dict: Dictionary["reviews"];
  errorsDict: Dictionary["errors"];
}

export function AddReviewDialog({ dict, errorsDict }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState<number | null>(5);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const showServerError = state && !state.ok && state.code !== "validation";

  return (
    <Box sx={{ textAlign: "center" }}>
      <Button variant="outlined" size="large" onClick={() => setOpen(true)}>
        {dict.addButton}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          {dict.form.title}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {state?.ok ? (
            <BookingSuccess dict={{ success: dict.form.success }} />
          ) : (
            <form action={action}>
              <Stack spacing={3} sx={{ pt: 1 }}>
                <TextField
                  name="author"
                  label={dict.form.author}
                  error={!!fieldErrors?.author}
                  helperText={fieldErrors?.author?.[0]}
                  fullWidth
                  required
                />

                <TextField
                  name="carModel"
                  label={dict.form.carModel}
                  error={!!fieldErrors?.carModel}
                  helperText={fieldErrors?.carModel?.[0]}
                  fullWidth
                  required
                />

                <Box>
                  <Typography component="legend" variant="body2" color="text.secondary">
                    {dict.form.rating}
                  </Typography>
                  <Rating name="rating" value={rating} onChange={(_event, value) => setRating(value)} />
                </Box>

                <TextField
                  name="text"
                  label={dict.form.text}
                  multiline
                  minRows={3}
                  error={!!fieldErrors?.text}
                  helperText={fieldErrors?.text?.[0]}
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
                    {isPending ? dict.form.submitting : dict.form.submit}
                  </Button>
                </Box>
              </Stack>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
