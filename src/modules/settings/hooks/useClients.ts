import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  ClientListQuery,
  ClientListResult,
  ClientPayload,
  ClientRow,
} from "../types";

const clientApi = createResourceApi<ClientRow, ClientListQuery, ClientPayload>(
  "/clients",
);

const clientCrud = createResourceHooks<
  ClientListQuery,
  ClientPayload,
  { items: ClientRow[]; meta: ClientListResult["meta"] }
>("clients", {
  list: clientApi.list,
  create: clientApi.create,
  update: clientApi.update,
  remove: clientApi.remove,
});

export const useClients = clientCrud.useList;
export const useCreateClient = clientCrud.useCreate;
export const useUpdateClient = clientCrud.useUpdate;
export const useDeleteClient = clientCrud.useDelete;

export function useClientsAll() {
  return useQuery({
    queryKey: ["clients", "all"],
    queryFn: async () => {
      const res = await http.get<{ data: ClientRow[] }>("/clients/all");
      return res.data.data;
    },
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const res = await http.get<{ data: ClientRow }>(`/clients/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
