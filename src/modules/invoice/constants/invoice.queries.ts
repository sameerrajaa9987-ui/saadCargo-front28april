import { MASTER_LIST_LIMIT } from "@/shared/constants/queries";

export const INVOICE_MASTER_QUERIES = {
  parties: {
    page: 1,
    limit: MASTER_LIST_LIMIT,
    sortBy: "name",
    sortDir: "asc" as const,
  },
  onBillConsignments: (party: string | undefined) => ({
    party: party || undefined,
    paymentMode: "on_bill" as const,
    page: 1,
    limit: MASTER_LIST_LIMIT,
    sortBy: "date",
    sortDir: "desc" as const,
  }),
} as const;
