"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, Stack } from "@mui/material";
import { DataTable, type Column } from "@/components/ui/DataTable";
import type { Service } from "@/types";
import { createService, updateService } from "../actions";
import {
  ServiceFormDialog,
  type ServiceFormResult,
  type ServiceFormTarget,
} from "./ServiceFormDialog";
import type { ServiceInput } from "../schema";

interface ServicesTableProps {
  services: Service[];
  saveErrorText: string;
}

export function ServicesTable({ services, saveErrorText }: ServicesTableProps) {
  const router = useRouter();
  const [target, setTarget] = useState<ServiceFormTarget>(null);

  const handleSave = async (saveTarget: Service | "new", input: ServiceInput): Promise<ServiceFormResult> => {
    const result =
      saveTarget === "new" ? await createService(input) : await updateService(saveTarget.id, input);

    if (result.ok) router.refresh();
    return result;
  };

  const columns: Column<Service>[] = [
    { header: "Order", render: (service) => service.order },
    { header: "Title (UK)", render: (service) => service.titleUk },
    { header: "Title (EN)", render: (service) => service.titleEn },
    { header: "Slug", render: (service) => service.slug },
    { header: "Price", render: (service) => `${service.price} ₴` },
    { header: "Duration", render: (service) => service.duration },
    {
      header: "Status",
      render: (service) => (
        <Chip
          label={service.isActive ? "Active" : "Inactive"}
          color={service.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      render: (service) => (
        <Button size="small" onClick={() => setTarget(service)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setTarget("new")}>
          Add service
        </Button>
      </Stack>

      <DataTable rows={services} columns={columns} empty="No services yet." />

      <ServiceFormDialog
        target={target}
        errorText={saveErrorText}
        onClose={() => setTarget(null)}
        onSave={handleSave}
      />
    </>
  );
}
