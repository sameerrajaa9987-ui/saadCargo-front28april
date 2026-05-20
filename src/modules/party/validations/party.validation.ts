import { z } from "zod";

export const partySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  mobile: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  gstin: z.string().trim().optional(),
  pan: z.string().trim().optional(),
});

export type PartyFormValues = z.infer<typeof partySchema>;
