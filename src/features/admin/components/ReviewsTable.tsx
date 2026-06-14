"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Paper,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Review } from "@/types";
import { deleteReview, toggleReviewVisibility } from "../actions";

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, isVisible: boolean) => {
    setPendingId(id);
    startTransition(async () => {
      await toggleReviewVisibility(id, isVisible);
      setPendingId(null);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      await deleteReview(id);
      setPendingId(null);
      router.refresh();
    });
  };

  if (reviews.length === 0) {
    return <Typography color="text.secondary">No reviews yet.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell>Car</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => {
            const rowPending = isPending && pendingId === review.id;

            return (
              <TableRow key={review.id}>
                <TableCell>{review.author}</TableCell>
                <TableCell>{review.carModel}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly size="small" />
                </TableCell>
                <TableCell sx={{ maxWidth: 320 }}>
                  <Typography variant="body2">{review.textUk}</Typography>
                </TableCell>
                <TableCell>{new Date(review.createdAt).toLocaleDateString("en-GB")}</TableCell>
                <TableCell>
                  <Chip
                    label={review.isVisible ? "Visible" : "Hidden"}
                    color={review.isVisible ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      disabled={rowPending}
                      onClick={() => handleToggle(review.id, !review.isVisible)}
                    >
                      {review.isVisible ? "Hide" : "Show"}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      disabled={rowPending}
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
