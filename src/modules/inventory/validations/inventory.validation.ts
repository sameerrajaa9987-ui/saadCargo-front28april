import { z } from "zod";

export const inventoryFormSchema = z.object({
  itemName: z.string().trim().min(1, "Item Name is required"),
  bookingId: z.string().trim().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.enum(["KG", "Pieces", "Boxes"]),
  location: z.string().trim().optional(),
  status: z.enum(["warehouse", "in_transit", "delivered"]),
});

export const inventoryPayloadSchema = z.object({
  itemName: z.string().trim().min(1, "Item Name is required"),
  bookingId: z.string().trim().optional(),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.enum(["KG", "Pieces", "Boxes"]),
  location: z.string().trim().optional(),
  status: z.enum(["warehouse", "in_transit", "delivered"]).optional(),
});

export type InventoryFormSchema = z.infer<typeof inventoryFormSchema>;
export type InventoryPayloadSchema = z.infer<typeof inventoryPayloadSchema>;
