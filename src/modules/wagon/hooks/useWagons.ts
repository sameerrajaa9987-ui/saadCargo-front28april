import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  WagonListQuery,
  WagonListResult,
  WagonPayload,
  WagonRow,
} from "../types";

const wagonApi = createResourceApi<WagonRow, WagonListQuery, WagonPayload>(
  "/wagons",
);

const wagonCrud = createResourceHooks<
  WagonListQuery,
  WagonPayload,
  { items: WagonRow[]; meta: WagonListResult["meta"] }
>("wagons", {
  list: wagonApi.list,
  create: wagonApi.create,
  update: wagonApi.update,
  remove: wagonApi.remove,
});

export const useWagons = wagonCrud.useList;
export const useCreateWagon = wagonCrud.useCreate;
export const useUpdateWagon = wagonCrud.useUpdate;
export const useDeleteWagon = wagonCrud.useDelete;

export function useWagon(id: string) {
  return useQuery({
    queryKey: ["wagon", id],
    queryFn: async () => {
      const res = await http.get<{ data: WagonRow }>(`/wagons/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
