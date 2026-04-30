export type InventoryStatus = "warehouse" | "in_transit" | "delivered";
export type InventoryUnit = "KG" | "Pieces" | "Boxes";

export type Ref = { id: string; label: string } | null | undefined;

export type InventoryRow = {
  id: string;
  itemName: string;
  booking: Ref;
  bookingId: string | null;
  quantity: number;
  unit: InventoryUnit;
  location: string;
  status: InventoryStatus;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
};

export type InventoryListQuery = {
  search?: string;
  status?: InventoryStatus;
  page?: number;
  limit?: number;
};

export type InventoryListResult = {
  data: InventoryRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type InventoryPayload = {
  itemName: string;
  bookingId?: string;
  quantity: number;
  unit: InventoryUnit;
  location?: string;
  status?: InventoryStatus;
};

export type InventoryFormState = {
  itemName: string;
  bookingId: string;
  quantity: string;
  unit: InventoryUnit;
  location: string;
  status: InventoryStatus;
};
