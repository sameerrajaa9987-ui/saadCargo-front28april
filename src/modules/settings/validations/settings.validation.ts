import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().trim().min(1, "Client Name is required"),
  phone: z.string().trim().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().trim().optional(),
});

export const clientPayloadSchema = z.object({
  name: z.string().trim().min(1, "Client Name is required"),
  phone: z.string().trim().optional(),
  email: z.string().email("Invalid email").optional(),
  address: z.string().trim().optional(),
});

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "operator", "accountant"]),
});

export const userPayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "operator", "accountant"]),
});

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
export type ClientPayloadSchema = z.infer<typeof clientPayloadSchema>;
export type UserFormSchema = z.infer<typeof userFormSchema>;
export type UserPayloadSchema = z.infer<typeof userPayloadSchema>;
