export type PartyLite = {
  id: string;
  name: string;
  mobile?: string;
  gstin?: string;
  defaultPaymentMode?: "paid_source" | "to_pay" | "on_bill" | "slip";
  address?: string;
};

export type InvoiceLite = {
  id: string;
  billNumber: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  date: string;
};

export type Consignment = {
  id: string;
  date: string;
  party: PartyLite | string | null;
  packages: number;
  actualWeight?: number;
  chargeableWeight: number;
  contents?: string;
  originStation: string;
  destinationStation: string;
  type: "railway_booking" | "own_bogie" | "agent_handover" | "agent_received";
  agentName?: string;
  trainNumber?: string;
  bogieNumber?: string;
  railwayReceiptNumber?: string;
  freightAmount: number;
  reimbursementAmount: number;
  hamaliCharges: number;
  otherCharges: number;
  totalAmount: number;
  paymentMode: "paid_source" | "to_pay" | "on_bill" | "slip";
  paymentStatus: "pending" | "received" | "settled";
  invoice?: InvoiceLite | string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ConsignmentListQuery = {
  search?: string;
  party?: string;
  paymentMode?: string;
  paymentStatus?: string;
  destinationStation?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type ConsignmentListResult = {
  items: Consignment[];
  meta: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
  };
};

export type ConsignmentCreatePayload = {
  date: string;
  party: string;
  packages: number;
  actualWeight?: number;
  chargeableWeight: number;
  contents?: string;
  originStation?: string;
  destinationStation: string;
  type: string;
  agentName?: string;
  trainNumber?: string;
  bogieNumber?: string;
  railwayReceiptNumber?: string;
  freightAmount: number;
  reimbursementAmount?: number;
  hamaliCharges?: number;
  otherCharges?: number;
  paymentMode: string;
  notes?: string;
};
