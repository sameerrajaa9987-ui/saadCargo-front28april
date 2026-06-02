export type Pod = {
  id: string;
  podNumber: number;
  date: string;
  consignorName: string;
  consignorMobile?: string;
  consignorAddress?: string;
  consigneeName: string;
  consigneeMobile?: string;
  consigneeAddress?: string;
  party?: { id: string; name: string; mobile?: string } | string | null;
  packages: number;
  actualWeight?: number;
  chargeableWeight: number;
  contents?: string;
  givenName?: string;
  originStation: string;
  destinationStation: string;
  paidAmount: number;
  toPayAmount: number;
  otherCharges: number;
  totalAmount: number;
  deliveryStatus: "received" | "loaded" | "in_transit" | "delivered" | "returned";
  loadedOn?: string;
  deliveredOn?: string;
  railwayReceiptNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type PodListQuery = {
  search?: string;
  deliveryStatus?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type PodListResult = {
  items: Pod[];
  meta: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
  };
};

export type PodCreatePayload = {
  date: string;
  consignorName: string;
  consignorMobile?: string;
  consignorAddress?: string;
  consigneeName: string;
  consigneeMobile?: string;
  consigneeAddress?: string;
  packages: number;
  actualWeight?: number;
  chargeableWeight: number;
  contents?: string;
  givenName?: string;
  originStation?: string;
  destinationStation: string;
  paidAmount?: number;
  toPayAmount?: number;
  otherCharges?: number;
  railwayReceiptNumber?: string;
  notes?: string;
};
