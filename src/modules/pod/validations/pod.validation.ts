import { z } from "zod";

/**
 * Frontend form schema for POD (bilti).
 *
 * Note: numeric and station fields are required here; sensible defaults
 * (0, "MUM") live in the dialog's defaultValues, NOT in the schema.
 * This keeps z.infer<> producing a single uniform type and lets zodResolver
 * type-check cleanly.
 */
export const podSchema = z.object({
  date: z.string().min(1, "Date is required"),
  consignorName: z.string().trim().min(1, "Consignor name is required"),
  consignorMobile: z.string().trim().optional(),
  consignorAddress: z.string().trim().optional(),
  consigneeName: z.string().trim().min(1, "Consignee name is required"),
  consigneeMobile: z.string().trim().optional(),
  consigneeAddress: z.string().trim().optional(),
  packages: z.coerce.number().int().min(1, "At least 1 package"),
  actualWeight: z.coerce.number().min(0).optional(),
  chargeableWeight: z.coerce.number().min(0.01, "Chargeable weight required"),
  contents: z.string().trim().optional(),
  givenName: z.string().trim().optional(),
  originStation: z.string().trim().min(1, "Origin required"),
  destinationStation: z
    .string()
    .trim()
    .min(1, "Destination required")
    .transform((v) => v.toUpperCase()),
  paidAmount: z.coerce.number().min(0),
  toPayAmount: z.coerce.number().min(0),
  otherCharges: z.coerce.number().min(0),
  railwayReceiptNumber: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type PodFormValues = z.infer<typeof podSchema>;
