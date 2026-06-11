"use client";

import { useState, useTransition } from "react";
import {
  Chip,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
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
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, event: SelectChangeEvent<BookingStatus>) => {
    const status = event.target.value as BookingStatus;
    setPendingId(id);
    startTransition(async () => {
      await updateBookingStatus(id, status);
      setPendingId(null);
    });
  };

  if (bookings.length === 0) {
    return <Typography color="text.secondary">No bookings yet.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Car</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.name}</TableCell>
              <TableCell>
                <Typography variant="body2">{booking.phone}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {booking.email}
                </Typography>
              </TableCell>
              <TableCell>
                {booking.carModel} ({booking.year})
              </TableCell>
              <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select<BookingStatus>
                  value={booking.status}
                  size="small"
                  disabled={isPending && pendingId === booking.id}
                  onChange={(event) => handleStatusChange(booking.id, event)}
                  renderValue={(value) => (
                    <Chip label={value} color={STATUS_COLORS[value]} size="small" />
                  )}
                >
                  {STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
