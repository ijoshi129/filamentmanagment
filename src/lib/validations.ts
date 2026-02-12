import { z } from "zod";

// Spool status enum
export const SPOOL_STATUSES = ["sealed", "in_use", "empty"] as const;
export type SpoolStatus = (typeof SPOOL_STATUSES)[number];

// Validation schema for creating a new spool
export const createSpoolSchema = z.object({
  brand: z.string().min(1, "Brand is required").max(100),
  material: z.string().min(1, "Material is required").max(50),
  modifier: z
    .string()
    .max(50)
    .nullable()
    .optional()
    .transform((val) => val ?? null),
  colorName: z.string().min(1, "Color name is required").max(100),
  colorHex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  status: z.enum(SPOOL_STATUSES).default("sealed"),
  initialWeight: z.number().int().positive().default(1000),
  purchaseDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val ?? null),
  price: z
    .number()
    .positive()
    .nullable()
    .optional()
    .transform((val) => val ?? null),
  notes: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .transform((val) => val ?? null),
});

// Validation schema for updating a spool (all fields optional)
export const updateSpoolSchema = createSpoolSchema.partial();

// Inferred types
export type CreateSpoolInput = z.infer<typeof createSpoolSchema>;
export type UpdateSpoolInput = z.infer<typeof updateSpoolSchema>;
