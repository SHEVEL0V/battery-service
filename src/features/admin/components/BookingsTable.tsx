"use client";

import {
  Chip,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/format/date";
import { useRowAction } from "@/lib/hooks/useRowAction";
import type { Booking, BookingStatus } from "@/types";
import { updateBookingStatus } from "../actions";

const STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const STATUS_COLORS: Record<BookingStatus, "default" | "info" | "warning" | "success" | "error"> = {
  PENDING: "default",
  CONFIRMED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "error",
};

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const { pendingId, isPending, run } = useRowAction();

  const handleStatusChange = (id: string, event: SelectChangeEvent<BookingStatus>) => {
    run(id, () => updateBookingStatus(id, event.target.value as BookingStatus));
  };

  const columns: Column<Booking>[] = [
    { header: "Name", render: (booking) => booking.name },
    {
      header: "Contact",
      render: (booking) => (
        <>
          <Typography variant="body2">{booking.phone}</Typography>
          <Typography variant="caption" color="text.secondary">
            {booking.email}
          </Typography>
        </>
      ),
    },
    { header: "Car", render: (booking) => `${booking.carModel} (${booking.year})` },
    {
      header: "Preferred date",
      render: (booking) => (booking.preferredDate ? formatDate(booking.preferredDate) : "—"),
    },
    { header: "Created", render: (booking) => formatDate(booking.createdAt) },
    {
      header: "Status",
      render: (booking) => (
        <Select<BookingStatus>
          value={booking.status}
          size="small"
          disabled={isPending && pendingId === booking.id}
          onChange={(event) => handleStatusChange(booking.id, event)}
          renderValue={(value) => <Chip label={value} color={STATUS_COLORS[value]} size="small" />}
        >
          {STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      ),
    },
  ];

  return <DataTable rows={bookings} columns={columns} empty="No bookings yet." />;
}
