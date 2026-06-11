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

const initialState: ReviewState = {};

export function AddReviewDialog({ dict }: { dict: Dictionary["reviews"] }) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState<number | null>(5);

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
          {state.success ? (
            <BookingSuccess dict={{ success: dict.form.success }} />
          ) : (
            <form action={action}>
              <Stack spacing={3} sx={{ pt: 1 }}>
                <TextField
                  name="author"
                  label={dict.form.author}
                  error={!!state.errors?.author}
                  helperText={state.errors?.author?.[0]}
                  fullWidth
                  required
                />

                <TextField
                  name="carModel"
                  label={dict.form.carModel}
                  error={!!state.errors?.carModel}
                  helperText={state.errors?.carModel?.[0]}
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
                  error={!!state.errors?.text}
                  helperText={state.errors?.text?.[0]}
                  fullWidth
                  required
                />

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
