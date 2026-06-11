import { z } from "zod";

export const reviewSchema = z.object({
  author: z.string().min(2),
  carModel: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().min(10),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
