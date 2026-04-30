import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function createResourceHooks<
  TListQuery extends object,
  TCreatePayload extends object,
  TListResult,
>(
  key: string,
  api: {
    list: (query: TListQuery) => Promise<TListResult>;
    create: (payload: TCreatePayload) => Promise<unknown>;
    update: (id: string, payload: Partial<TCreatePayload>) => Promise<unknown>;
    remove: (id: string) => Promise<void>;
  },
) {
  const KEYS = {
    all: [key] as const,
    lists: () => [...KEYS.all, "list"] as const,
    list: (filters: TListQuery) => [...KEYS.lists(), filters] as const,
  };

  function useList(query: TListQuery) {
    return useQuery({
      queryKey: KEYS.list(query),
      queryFn: () => api.list(query),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<TCreatePayload>;
      }) => api.update(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      },
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.remove,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      },
    });
  }

  return { KEYS, useList, useCreate, useUpdate, useDelete };
}
