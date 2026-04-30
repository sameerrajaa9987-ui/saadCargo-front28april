export type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientListQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export type ClientListResult = {
  data: ClientRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type ClientPayload = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type ClientFormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "accountant";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserListQuery = {
  search?: string;
  role?: "admin" | "operator" | "accountant";
  page?: number;
  limit?: number;
};

export type UserListResult = {
  data: UserRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type UserPayload = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "operator" | "accountant";
};

export type UserFormState = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "operator" | "accountant";
};
