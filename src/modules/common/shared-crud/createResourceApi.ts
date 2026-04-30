import { http } from "@/shared/api/http";

type ListResponse<TItem> = {
  data: TItem[];
  meta: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
  };
};

export function createResourceApi<
  TItem,
  TListQuery extends object,
  TCreatePayload extends object,
>(resourcePath: string) {
  return {
    async list(query: TListQuery) {
      const res = await http.get<ListResponse<TItem>>(resourcePath, {
        params: query,
      });
      return {
        items: res.data.data,
        meta: res.data.meta,
      };
    },

    async create(payload: TCreatePayload) {
      const res = await http.post<{ data: TItem }>(resourcePath, payload);
      return res.data.data;
    },

    async update(id: string, payload: Partial<TCreatePayload>) {
      const res = await http.patch<{ data: TItem }>(
        `${resourcePath}/${id}`,
        payload,
      );
      return res.data.data;
    },

    async remove(id: string) {
      await http.delete(`${resourcePath}/${id}`);
    },
  };
}
