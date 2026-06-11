"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Service } from "@/types";
import { updateService, type UpdateServiceState } from "../actions";
import { ServiceEditDialog } from "./ServiceEditDialog";
import type { ServiceInput } from "../schema";

export function ServicesTable({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [, startTransition] = useTransition();
  const [optimisticServices, setOptimisticService] = useOptimistic(
    services,
    (state, updated: Service) => state.map((s) => (s.id === updated.id ? updated : s)),
  );

  const handleSave = (id: string, input: ServiceInput): Promise<UpdateServiceState> => {
    const original = services.find((s) => s.id === id);

    return new Promise((resolve) => {
      startTransition(async () => {
        if (original) setOptimisticService({ ...original, ...input });
        resolve(await updateService(id, input));
      });
    });
  };

  if (optimisticServices.length === 0) {
    return <Typography color="text.secondary">No services yet.</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Title (UK)</TableCell>
              <TableCell>Title (EN)</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {optimisticServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.order}</TableCell>
                <TableCell>{service.titleUk}</TableCell>
                <TableCell>{service.titleEn}</TableCell>
                <TableCell>{service.slug}</TableCell>
                <TableCell>{service.price} ₴</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={service.isActive ? "Active" : "Inactive"}
                    color={service.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => setEditing(service)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ServiceEditDialog service={editing} onClose={() => setEditing(null)} onSave={handleSave} />
    </>
  );
}
