import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "required"),
  phone: z.string().min(7, "required"),
  email: z.email(),
  carModel: z.string().min(1, "required"),
  year: z.coerce
    .number()
    .int()
    .min(2012, "Tesla виробляється з 2012 р.")
    .max(new Date().getFullYear() + 1),
  date: z.string().min(1, "required"),
  message: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
