import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http";
import type {
  AuditLogListQuery,
  AuditLogListResult,
  AuditLogRow,
} from "../types";

export function useAuditLogs(query: AuditLogListQuery = {}) {
  return useQuery({
    queryKey: ["audit-logs", query],
    queryFn: async () => {
      const res = await http.get<{
        data: AuditLogRow[];
        meta: AuditLogListResult["meta"];
      }>("/audit-logs", { params: query });
      return {
        items: res.data.data,
        meta: res.data.meta,
      };
    },
  });
}
