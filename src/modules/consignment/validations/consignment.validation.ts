import { z } from "zod";

/**
 * Frontend form schema for consignments.
 *
 * Note: keep every field required (use empty string / 0 / undefined defaults
 * in the dialog's defaultValues). Avoid .default() in the schema — it creates
 * an input/output type divergence that breaks zodResolver typing.
 */
export const consignmentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  party: z.string().min(1, "Party is required"),
  packages: z.coerce.number().int().min(1, "At least 1 package"),
  actualWeight: z.coerce.number().min(0).optional(),
  chargeableWeight: z.coerce.number().min(0.1, "Chargeable weight required"),
  contents: z.string().trim().optional(),
  originStation: z.string().trim().min(1, "Origin required"),
  destinationStation: z
    .string()
    .trim()
    .min(1, "Destination required")
    .transform((v) => v.toUpperCase()),
  type: z.enum(["railway_booking", "own_bogie", "agent_handover", "agent_received"]),
  agentName: z.string().trim().optional(),
  trainNumber: z.string().trim().optional(),
  bogieNumber: z.string().trim().optional(),
  railwayReceiptNumber: z.string().trim().optional(),
  freightAmount: z.coerce.number().min(0),
  reimbursementAmount: z.coerce.number().min(0),
  hamaliCharges: z.coerce.number().min(0),
  otherCharges: z.coerce.number().min(0),
  paymentMode: z.enum(["paid_source", "to_pay", "on_bill", "slip"]),
  notes: z.string().trim().optional(),
});

export type ConsignmentFormValues = z.infer<typeof consignmentSchema>;
