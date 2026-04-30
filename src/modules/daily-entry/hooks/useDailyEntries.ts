import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http";
import type {
  DailyEntryListQuery,
  DailyEntryListResult,
  DailyEntryPayload,
  DailyEntryRow,
} from "../types";

export function useDailyEntries(query: DailyEntryListQuery = {}) {
  return useQuery({
    queryKey: ["daily-entries", query],
    queryFn: async () => {
      const res = await http.get<DailyEntryListResult>("/daily-entries", {
        params: query,
      });
      return res.data;
    },
  });
}

export function useDailyEntry(id: string) {
  return useQuery({
    queryKey: ["daily-entry", id],
    queryFn: async () => {
      const res = await http.get<{ data: DailyEntryRow }>(
        `/daily-entries/${id}`,
      );
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateDailyEntry() {
  return useMutation({
    mutationFn: (payload: DailyEntryPayload) => {
      return http
        .post<{ data: DailyEntryRow }>("/daily-entries", payload)
        .then((res) => res.data.data);
    },
  });
}

export function useUpdateDailyEntry() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<DailyEntryPayload>;
    }) => {
      return http
        .patch<{ data: DailyEntryRow }>(`/daily-entries/${id}`, payload)
        .then((res) => res.data.data);
    },
  });
}

export function useDeleteDailyEntry() {
  return useMutation({
    mutationFn: (id: string) => {
      return http.delete(`/daily-entries/${id}`);
    },
  });
}
