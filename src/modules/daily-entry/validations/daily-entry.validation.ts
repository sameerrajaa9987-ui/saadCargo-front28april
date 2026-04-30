import { z } from "zod";

export const dailyEntryFormSchema = z
  .object({
    date: z.string().trim().optional(),
    entryType: z.enum(["booking", "expense", "payment"]),
    clientId: z.string().trim().optional(),
    clientName: z.string().trim().optional(),
    bookingId: z.string().trim().optional(),
    description: z.string().trim().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required"),
    paymentMode: z.enum(["cash", "bank", "upi", "cheque"]).optional(),
    paymentType: z.enum(["received", "paid", "expense"]).optional(),
    referenceNumber: z.string().trim().optional(),
    category: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .refine((data) => Number(data.amount) > 0, {
    message: "Amount must be greater than 0",
    path: ["amount"],
  });

export const dailyEntryPayloadSchema = z.object({
  date: z.string().trim().optional(),
  entryType: z.enum(["booking", "expense", "payment"]),
  clientId: z.string().trim().optional(),
  clientName: z.string().trim().optional(),
  bookingId: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  paymentMode: z.enum(["cash", "bank", "upi", "cheque"]).optional(),
  paymentType: z.enum(["received", "paid", "expense"]).optional(),
  referenceNumber: z.string().trim().optional(),
  category: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type DailyEntryFormSchema = z.infer<typeof dailyEntryFormSchema>;
export type DailyEntryPayloadSchema = z.infer<typeof dailyEntryPayloadSchema>;
