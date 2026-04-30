import { z } from "zod";

export const bookingFormSchema = z.object({
  clientId: z.string().trim().min(1, "Client is required"),
  sourceStation: z.string().trim().min(1, "Source Station is required"),
  destinationStation: z
    .string()
    .trim()
    .min(1, "Destination Station is required"),
  parcelType: z.enum(["General", "Fragile", "Perishable", "Machinery"]),
  weightKg: z.string().min(1, "Weight is required"),
  bookingType: z.enum(["Tender-based", "Railway Parcel"]),
  costPrice: z.string().min(1, "Cost Price is required"),
  sellingPrice: z.string().min(1, "Selling Price is required"),
  notes: z.string().trim().optional(),
});

export const bookingPayloadSchema = z.object({
  clientId: z.string().trim().min(1, "Client is required"),
  sourceStation: z.string().trim().min(1, "Source Station is required"),
  destinationStation: z
    .string()
    .trim()
    .min(1, "Destination Station is required"),
  parcelType: z.enum(["General", "Fragile", "Perishable", "Machinery"]),
  weightKg: z.number().min(0.01, "Weight must be greater than 0"),
  bookingType: z.enum(["Tender-based", "Railway Parcel"]),
  costPrice: z.number().min(0, "Cost Price cannot be negative"),
  sellingPrice: z.number().min(0, "Selling Price cannot be negative"),
  notes: z.string().trim().optional(),
});

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
export type BookingPayloadSchema = z.infer<typeof bookingPayloadSchema>;
