"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Service } from "@/types";
import { createService, updateService } from "../actions";
import {
  ServiceFormDialog,
  type ServiceFormResult,
  type ServiceFormTarget,
} from "./ServiceFormDialog";
import type { ServiceInput } from "../schema";

type OptimisticAction =
  | { type: "create"; service: Service }
  | { type: "update"; service: Service };

interface ServicesTableProps {
  services: Service[];
  saveErrorText: string;
}

export function ServicesTable({ services, saveErrorText }: ServicesTableProps) {
  const router = useRouter();
  const [target, setTarget] = useState<ServiceFormTarget>(null);
  const [, startTransition] = useTransition();
  const [optimisticServices, applyOptimistic] = useOptimistic(
    services,
    (state, action: OptimisticAction) => {
      if (action.type === "update") {
        return state.map((s) => (s.id === action.service.id ? action.service : s));
      }
      return [...state, action.service];
    },
  );

  const handleSave = (saveTarget: Service | "new", input: ServiceInput): Promise<ServiceFormResult> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        if (saveTarget === "new") {
          applyOptimistic({ type: "create", service: { id: `optimistic-${Date.now()}`, ...input } });
          const result = await createService(input);
          if (result.ok) router.refresh();
          resolve(result);
          return;
        }

        applyOptimistic({ type: "update", service: { ...saveTarget, ...input } });
        const result = await updateService(saveTarget.id, input);
        if (result.ok) router.refresh();
        resolve(result);
      });
    });
  };

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setTarget("new")}>
          Add service
        </Button>
      </Stack>

      {optimisticServices.length === 0 ? (
        <Typography color="text.secondary">No services yet.</Typography>
      ) : (
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
                    <Button size="small" onClick={() => setTarget(service)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ServiceFormDialog
        target={target}
        errorText={saveErrorText}
        onClose={() => setTarget(null)}
        onSave={handleSave}
      />
    </>
  );
}
