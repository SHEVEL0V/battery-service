"use client";

import { Button, Chip, Rating, Stack, Typography } from "@mui/material";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/format/date";
import { useRowAction } from "@/lib/hooks/useRowAction";
import type { Review } from "@/types";
import { deleteReview, toggleReviewVisibility } from "../actions";

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const { pendingId, isPending, run } = useRowAction();

  const columns: Column<Review>[] = [
    { header: "Author", render: (review) => review.author },
    { header: "Car", render: (review) => review.carModel },
    { header: "Rating", render: (review) => <Rating value={review.rating} readOnly size="small" /> },
    {
      header: "Review",
      sx: { maxWidth: 320 },
      render: (review) => <Typography variant="body2">{review.textUk}</Typography>,
    },
    { header: "Created", render: (review) => formatDate(review.createdAt) },
    {
      header: "Status",
      render: (review) => (
        <Chip
          label={review.isVisible ? "Visible" : "Hidden"}
          color={review.isVisible ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      header: "Actions",
      align: "right",
      render: (review) => {
        const rowPending = isPending && pendingId === review.id;
        return (
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
            <Button
              size="small"
              disabled={rowPending}
              onClick={() => run(review.id, () => toggleReviewVisibility(review.id, !review.isVisible))}
            >
              {review.isVisible ? "Hide" : "Show"}
            </Button>
            <Button
              size="small"
              color="error"
              disabled={rowPending}
              onClick={() => run(review.id, () => deleteReview(review.id))}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  return <DataTable rows={reviews} columns={columns} empty="No reviews yet." />;
}
