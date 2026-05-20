import { z } from "zod";

/**
 * Frontend form schemas for invoices.
 *
 * Note: tax-rate fields are required here. Defaults (e.g. 2.5%) live in the
 * dialog's defaultValues, NOT in the schema, so z.infer<> produces a single
 * type with no input/output divergence.
 */
export const invoiceSchema = z.object({
  party: z.string().min(1, "Party is required"),
  date: z.string().min(1, "Date is required"),
  consignmentIds: z.array(z.string()).min(1, "Select at least one consignment"),
  cgstRate: z.coerce.number().min(0).max(50),
  sgstRate: z.coerce.number().min(0).max(50),
  igstRate: z.coerce.number().min(0).max(50),
  notes: z.string().trim().optional(),
});

export const invoiceEditSchema = z.object({
  date: z.string().min(1, "Date is required"),
  cgstRate: z.coerce.number().min(0).max(50),
  sgstRate: z.coerce.number().min(0).max(50),
  igstRate: z.coerce.number().min(0).max(50),
  notes: z.string().trim().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceEditFormValues = z.infer<typeof invoiceEditSchema>;
