import { z } from "zod";

export const paymentFormSchema = z.object({
  type: z.enum(["received", "paid", "expense"]),
  clientOrVendorName: z
    .string()
    .trim()
    .min(1, "Client/Vendor Name is required"),
  clientId: z.string().trim().optional(),
  amount: z.string().min(1, "Amount is required"),
  mode: z.enum(["cash", "bank", "upi", "cheque"]),
  date: z.string().trim().min(1, "Date is required"),
  referenceNumber: z.string().trim().optional(),
  linkedBookingId: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const paymentPayloadSchema = z.object({
  type: z.enum(["received", "paid", "expense"]),
  clientOrVendorName: z
    .string()
    .trim()
    .min(1, "Client/Vendor Name is required"),
  clientId: z.string().trim().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  mode: z.enum(["cash", "bank", "upi", "cheque"]),
  date: z.string().trim().min(1, "Date is required"),
  referenceNumber: z.string().trim().optional(),
  linkedBookingId: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>;
export type PaymentPayloadSchema = z.infer<typeof paymentPayloadSchema>;
