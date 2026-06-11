import type { Service } from "@/types";

// Service з уже вибраними під локаль title/description — повертається з queries.ts
export type LocalizedService = Service & {
  title: string;
  description: string;
};
