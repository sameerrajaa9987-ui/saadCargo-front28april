import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  InventoryListQuery,
  InventoryListResult,
  InventoryPayload,
  InventoryRow,
} from "../types";

const inventoryApi = createResourceApi<
  InventoryRow,
  InventoryListQuery,
  InventoryPayload
>("/inventory");

const inventoryCrud = createResourceHooks<
  InventoryListQuery,
  InventoryPayload,
  { items: InventoryRow[]; meta: InventoryListResult["meta"] }
>("inventory", {
  list: inventoryApi.list,
  create: inventoryApi.create,
  update: inventoryApi.update,
  remove: inventoryApi.remove,
});

export const useInventory = inventoryCrud.useList;
export const useCreateInventory = inventoryCrud.useCreate;
export const useUpdateInventory = inventoryCrud.useUpdate;
export const useDeleteInventory = inventoryCrud.useDelete;

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: async () => {
      const res = await http.get<{ data: InventoryRow }>(`/inventory/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
