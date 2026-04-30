import { z } from "zod";

export const wagonFormSchema = z.object({
  wagonId: z.string().trim().min(1, "Wagon ID is required"),
  linkedBookingId: z.string().trim().optional(),
  departureStation: z.string().trim().optional(),
  destinationStation: z.string().trim().optional(),
  departureTime: z.string().trim().min(1, "Departure Time is required"),
  expectedArrival: z.string().trim().min(1, "Expected Arrival is required"),
  actualArrival: z.string().trim().optional(),
  status: z.enum(["pending", "in_transit", "arrived", "delivered"]),
});

export const wagonPayloadSchema = z.object({
  wagonId: z.string().trim().min(1, "Wagon ID is required"),
  linkedBookingId: z.string().trim().optional(),
  departureStation: z.string().trim().optional(),
  destinationStation: z.string().trim().optional(),
  departureTime: z.string().trim().min(1, "Departure Time is required"),
  expectedArrival: z.string().trim().min(1, "Expected Arrival is required"),
  actualArrival: z.string().trim().optional(),
  status: z.enum(["pending", "in_transit", "arrived", "delivered"]).optional(),
});

export type WagonFormSchema = z.infer<typeof wagonFormSchema>;
export type WagonPayloadSchema = z.infer<typeof wagonPayloadSchema>;
