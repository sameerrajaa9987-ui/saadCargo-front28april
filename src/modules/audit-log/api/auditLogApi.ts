import { http } from "@/shared/api/http";
import type { AuditLogListQuery, AuditLogListResult } from "../types";

export const auditLogApi = {
  list(query: AuditLogListQuery = {}) {
    return http
      .get<AuditLogListResult>("/audit-logs", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
};
