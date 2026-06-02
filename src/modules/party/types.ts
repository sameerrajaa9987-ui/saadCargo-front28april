export type Party = {
  id: string;
  name: string;
  mobile?: string;
  alternateMobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  defaultStation?: string;
  defaultPaymentMode?: "paid_source" | "to_pay" | "on_bill" | "slip";
  openingBalance?: number;
  gstin?: string;
  pan?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartyListQuery = {
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type PartyListResult = {
  items: Party[];
  meta: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
  };
};

export type PartyCreatePayload = {
  name: string;
  mobile?: string;
  alternateMobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  defaultStation?: string;
  defaultPaymentMode?: "paid_source" | "to_pay" | "on_bill" | "slip";
  openingBalance?: number;
  gstin?: string;
  pan?: string;
};
