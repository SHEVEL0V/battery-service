"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function useRowAction() {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = (id: string, action: () => Promise<unknown>) => {
    setPendingId(id);
    startTransition(async () => {
      await action();
      setPendingId(null);
      router.refresh();
    });
  };

  return { pendingId, isPending, run };
}
