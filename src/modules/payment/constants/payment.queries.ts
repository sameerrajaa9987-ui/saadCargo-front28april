import { MASTER_LIST_LIMIT } from "@/shared/constants/queries";

export const PAYMENT_MASTER_QUERIES = {
  parties: {
    page: 1,
    limit: MASTER_LIST_LIMIT,
    sortBy: "name",
    sortDir: "asc" as const,
  },
} as const;
