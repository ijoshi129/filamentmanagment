"use server";

import { db } from "@/lib/db";
import {
  brands,
  materials,
  modifiers,
  catalogColors,
} from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAvailableModifiers, getColors } from "@/lib/colors";

type ActionResult<T = object> =
  | ({ success: true } & T)
  | { success: false; error: string };

// ==================== Brands ====================

export async function addBrand(
  id: string,
  name: string
): Promise<ActionResult> {
  try {
    const maxOrder = db
      .select({ sortOrder: brands.sortOrder })
      .from(brands)
      .orderBy(asc(brands.sortOrder))
      .all();
    const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map((r) => r.sortOrder)) + 1 : 0;

    db.insert(brands).values({ id, name, sortOrder: nextOrder }).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to add brand" };
  }
}

export async function updateBrand(
  id: string,
  name: string
): Promise<ActionResult> {
  try {
    db.update(brands).set({ name }).where(eq(brands.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update brand" };
  }
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  try {
    db.delete(brands).where(eq(brands.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete brand" };
  }
}

// ==================== Materials ====================

export async function addMaterial(
  id: string,
  name: string,
  description: string
): Promise<ActionResult> {
  try {
    const maxOrder = db
      .select({ sortOrder: materials.sortOrder })
      .from(materials)
      .all();
    const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map((r) => r.sortOrder)) + 1 : 0;

    db.insert(materials).values({ id, name, description, sortOrder: nextOrder }).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to add material" };
  }
}

export async function updateMaterial(
  id: string,
  name: string,
  description: string
): Promise<ActionResult> {
  try {
    db.update(materials).set({ name, description }).where(eq(materials.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update material" };
  }
}

export async function deleteMaterial(id: string): Promise<ActionResult> {
  try {
    db.delete(materials).where(eq(materials.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete material" };
  }
}

// ==================== Modifiers ====================

export async function addModifier(
  id: string,
  name: string,
  suffix: string
): Promise<ActionResult> {
  try {
    const maxOrder = db
      .select({ sortOrder: modifiers.sortOrder })
      .from(modifiers)
      .all();
    const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map((r) => r.sortOrder)) + 1 : 0;

    db.insert(modifiers).values({ id, name, suffix, sortOrder: nextOrder }).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to add modifier" };
  }
}

export async function updateModifier(
  id: string,
  name: string,
  suffix: string
): Promise<ActionResult> {
  try {
    db.update(modifiers).set({ name, suffix }).where(eq(modifiers.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update modifier" };
  }
}

export async function deleteModifier(id: string): Promise<ActionResult> {
  try {
    db.delete(modifiers).where(eq(modifiers.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete modifier" };
  }
}

// ==================== Catalog Colors ====================

export async function getCatalogColors(
  brandId: string,
  materialId: string,
  modifierId: string
) {
  return getColors(brandId, materialId, modifierId);
}

export async function getCatalogModifiers(
  brandId: string,
  materialId: string
) {
  return getAvailableModifiers(brandId, materialId);
}

export async function addCatalogColor(
  brandId: string,
  materialId: string,
  modifierId: string,
  colorName: string,
  colorHex: string
): Promise<ActionResult> {
  try {
    const existing = db
      .select({ sortOrder: catalogColors.sortOrder })
      .from(catalogColors)
      .where(
        and(
          eq(catalogColors.brandId, brandId),
          eq(catalogColors.materialId, materialId),
          eq(catalogColors.modifierId, modifierId)
        )
      )
      .all();
    const nextOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.sortOrder)) + 1 : 0;

    db.insert(catalogColors)
      .values({
        id: crypto.randomUUID(),
        brandId,
        materialId,
        modifierId,
        colorName,
        colorHex,
        sortOrder: nextOrder,
      })
      .run();

    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to add color" };
  }
}

export async function updateCatalogColor(
  id: string,
  colorName: string,
  colorHex: string
): Promise<ActionResult> {
  try {
    db.update(catalogColors)
      .set({ colorName, colorHex })
      .where(eq(catalogColors.id, id))
      .run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update color" };
  }
}

export async function deleteCatalogColor(id: string): Promise<ActionResult> {
  try {
    db.delete(catalogColors).where(eq(catalogColors.id, id)).run();
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete color" };
  }
}

/** Get all catalog colors for a brand+material+modifier (with IDs for editing) */
export async function getCatalogColorsWithIds(
  brandId: string,
  materialId: string,
  modifierId: string
) {
  return db
    .select()
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
}
