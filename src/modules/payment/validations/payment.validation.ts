import { z } from "zod";

export const paymentSchema = z.object({
  party: z.string().min(1, "Party is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  mode: z.enum(["cash", "bank_transfer", "cheque", "upi", "other"]),
  referenceNumber: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
