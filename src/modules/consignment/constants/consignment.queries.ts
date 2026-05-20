import { MASTER_LIST_LIMIT } from "@/shared/constants/queries";

export const CONSIGNMENT_MASTER_QUERIES = {
  parties: {
    page: 1,
    limit: MASTER_LIST_LIMIT,
    sortBy: "name",
    sortDir: "asc" as const,
  },
} as const;

export const LOADING_LIST_DEFAULTS = {
  page: 1,
  limit: MASTER_LIST_LIMIT,
  sortBy: "destinationStation",
  sortDir: "asc" as const,
} as const;
