import { useQuery, useMutation } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  UserListQuery,
  UserListResult,
  UserPayload,
  UserRow,
} from "../types";

const userApi = createResourceApi<UserRow, UserListQuery, UserPayload>(
  "/users",
);

const userCrud = createResourceHooks<
  UserListQuery,
  UserPayload,
  { items: UserRow[]; meta: UserListResult["meta"] }
>("users", {
  list: userApi.list,
  create: userApi.create,
  update: userApi.update,
  remove: userApi.remove,
});

export const useUsers = userCrud.useList;
export const useCreateUser = userCrud.useCreate;
export const useUpdateUser = userCrud.useUpdate;
export const useDeleteUser = userCrud.useDelete;

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await http.get<{ data: UserRow }>(`/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      http
        .post<{ data: UserRow }>(`/users/${id}/reset-password`, { password })
        .then((res) => res.data.data),
  });
}
