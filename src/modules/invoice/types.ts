import type { Consignment } from "@/modules/consignment/types";

export type Invoice = {
  id: string;
  billNumber: string;
  billNumberRaw: number;
  party:
    | { id: string; name: string; mobile?: string; gstin?: string; address?: string }
    | string
    | null;
  partySnapshot?: { name?: string; address?: string; gstin?: string };
  date: string;
  consignments: Array<Consignment | string>;
  reimbursementSubtotal: number;
  serviceSubtotal: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grossTotal: number;
  amountInWords: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceListQuery = {
  party?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type InvoiceListResult = {
  items: Invoice[];
  meta: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
  };
};

export type InvoiceCreatePayload = {
  party: string;
  date: string;
  consignmentIds: string[];
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  notes?: string;
};
