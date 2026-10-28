import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(10).max(128),
  role: z.enum(["OWNER", "SITTER"]).default("OWNER"),
});
export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});
export const petSchema = z.object({
  name: z.string().trim().min(1).max(80),
  species: z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]),
  breed: z.string().max(100).optional().nullable(),
  ageYears: z.number().min(0).max(100).optional().nullable(),
  weightKg: z.number().min(0).max(500).optional().nullable(),
  temperament: z.string().max(500).optional().nullable(),
  notes: z.string().max(3000).optional().nullable(),
  feedingInstructions: z.string().max(2000).optional().nullable(),
  allergies: z.string().max(2000).optional().nullable(),
  medicationNotes: z.string().max(2000).optional().nullable(),
  vetName: z.string().max(150).optional().nullable(),
  vetPhone: z.string().max(40).optional().nullable(),
  emergencyContact: z.string().max(300).optional().nullable(),
  imageUrl: z.url().optional().nullable(),
});
export const bookingSchema = z.object({
  sitterId: z.string().min(1),
  petId: z.string().min(1),
  checkIn: z.iso.datetime(),
  checkOut: z.iso.datetime(),
  specialInstructions: z.string().max(3000).optional(),
});
export const sitterProfileSchema = z.object({
  headline: z.string().max(140).optional(),
  about: z.string().min(20).max(4000),
  city: z.string().min(2).max(100),
  locality: z.string().max(100).optional(),
  dailyRate: z.number().int().min(100).max(100000),
  yearsExperience: z.number().int().min(0).max(80).default(0),
  maxPets: z.number().int().min(1).max(20).default(1),
  acceptedSpecies: z
    .array(z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]))
    .min(1),
  acceptedSizes: z.array(z.string().max(30)).default(["small", "medium"]),
  homeDescription: z.string().max(2000).optional(),
  homeImageUrls: z.array(z.url()).max(20).default([]),
  amenities: z.array(z.string().max(80)).max(30).default([]),
  houseRules: z.array(z.string().max(300)).max(30).default([]),
  outdoorSpace: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});
