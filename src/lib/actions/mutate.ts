import "server-only";
import type { z } from "zod";
import type { CacheTag } from "@/lib/cache/cache-tags";
import { runAction, zodParse } from "./runAction";
import type { ActionResult } from "./types";

// Імперативна admin-мутація без форми: auth завжди, без валідації вводу
export function mutate(fn: () => Promise<unknown>, revalidate?: CacheTag[]): Promise<ActionResult> {
  return runAction({
    requireAuth: true,
    handler: async () => {
      await fn();
    },
    revalidate,
    logLabel: "[mutate]",
  });
}

// Як mutate, але з типізованим input + Zod-валідацією (повертає fieldErrors при невдачі)
export function mutateWith<S extends z.ZodType>(
  schema: S,
  input: unknown,
  fn: (data: z.infer<S>) => Promise<unknown>,
  revalidate?: CacheTag[],
): Promise<ActionResult<z.infer<S>>> {
  return runAction({
    requireAuth: true,
    parse: () => zodParse(schema, input),
    handler: async (data) => {
      await fn(data);
    },
    revalidate,
    logLabel: "[mutateWith]",
  });
}
