import { z } from "zod";

export const railwayBookingFormSchema = z.object({
  referenceNumber: z.string().trim().min(1, "Reference Number is required"),
  spacePurchased: z.string().trim().optional(),
  costPaid: z.string().min(1, "Cost Paid is required"),
  linkedBookingId: z.string().trim().optional(),
  date: z.string().trim().min(1, "Date is required"),
  notes: z.string().trim().optional(),
});

export const railwayBookingPayloadSchema = z.object({
  referenceNumber: z.string().trim().min(1, "Reference Number is required"),
  spacePurchased: z.string().trim().optional(),
  costPaid: z.number().min(0, "Cost Paid cannot be negative"),
  linkedBookingId: z.string().trim().optional(),
  date: z.string().trim().min(1, "Date is required"),
  notes: z.string().trim().optional(),
});

export type RailwayBookingFormSchema = z.infer<typeof railwayBookingFormSchema>;
export type RailwayBookingPayloadSchema = z.infer<
  typeof railwayBookingPayloadSchema
>;
