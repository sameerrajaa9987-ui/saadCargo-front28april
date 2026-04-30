export type AuditLogRow = {
  id: string;
  timestamp: string;
  user: {
    id: string;
    label: string;
    email?: string;
    role?: string | null;
  } | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: unknown;
  ipAddress: string;
};

export type AuditLogListQuery = {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AuditLogListResult = {
  data: AuditLogRow[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
