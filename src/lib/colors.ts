/**
 * Brand Color Catalogs — Database-backed
 *
 * Queries catalog_colors table for brand → material → modifier → colors.
 */

import { db } from "@/lib/db";
import { catalogColors } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export type FilamentColor = {
  name: string;
  hex: string;
};

/**
 * Get available modifiers for a brand + material combination.
 * Returns modifier IDs that actually exist in the catalog.
 */
export function getAvailableModifiers(
  brandId: string,
  materialId: string
): string[] {
  const rows = db
    .selectDistinct({ modifierId: catalogColors.modifierId })
    .from(catalogColors)
    .where(
      and(
        eq(catalogColors.brandId, brandId),
        eq(catalogColors.materialId, materialId)
      )
    )
    .all();

  return rows.map((r) => r.modifierId);
}

/**
 * Get colors for a specific brand + material + modifier combination.
 */
export function getColors(
  brandId: string,
  materialId: string,
  modifierId: string
): FilamentColor[] {
  const rows = db
    .select({
      name: catalogColors.colorName,
      hex: catalogColors.colorHex,
    })
    .from(catalogColors)
    .where(
      and(
        eq(catalogColors.brandId, brandId),
        eq(catalogColors.materialId, materialId),
        eq(catalogColors.modifierId, modifierId)
      )
    )
    .orderBy(asc(catalogColors.sortOrder))
    .all();

  return rows;
}

/**
 * Check if a brand has catalog data.
 */
export function hasCatalog(brandId: string): boolean {
  const row = db
    .select({ id: catalogColors.id })
    .from(catalogColors)
    .where(eq(catalogColors.brandId, brandId))
    .limit(1)
    .all();

  return row.length > 0;
}
