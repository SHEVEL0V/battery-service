import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  // Порожній рядок з форми не дійшов сюди — formAction відкидає "" перед валідацією
  email: z.email().optional(),
  message: z.string().min(10),
});

export type ContactInput = z.infer<typeof contactSchema>;
