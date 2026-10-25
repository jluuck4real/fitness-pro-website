import { z } from "zod";
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .refine((s) => !/[\r\n]/.test(s)),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0),
  requestId: z.string().uuid(),
});
