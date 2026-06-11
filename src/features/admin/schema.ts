import { z } from "zod";

export const serviceSchema = z.object({
  slug: z.string().min(2),
  titleUk: z.string().min(2),
  titleEn: z.string().min(2),
  descUk: z.string().min(2),
  descEn: z.string().min(2),
  price: z.coerce.number().int().min(0),
  duration: z.string().min(1),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
