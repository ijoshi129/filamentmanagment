/**
 * Material Types, Modifiers, and Brands — Database-backed
 *
 * Server-only functions that query DB.
 * Client-safe formatting helpers are in materials-format.ts
 */

import { db } from "@/lib/db";
import { brands, materials, modifiers } from "@/db/schema";
import { asc } from "drizzle-orm";

export type MaterialType = {
  id: string;
  name: string;
  description: string | null;
};

export type MaterialModifier = {
  id: string;
  name: string;
  suffix: string;
};

export type Brand = {
  id: string;
  name: string;
};

/** Fetch all brands from DB, ordered by sortOrder */
export function getBrands(): Brand[] {
  return db
    .select({ id: brands.id, name: brands.name })
    .from(brands)
    .orderBy(asc(brands.sortOrder))
    .all();
}

/** Fetch all materials from DB, ordered by sortOrder */
export function getMaterials(): MaterialType[] {
  return db
    .select({
      id: materials.id,
      name: materials.name,
      description: materials.description,
    })
    .from(materials)
    .orderBy(asc(materials.sortOrder))
    .all();
}

/** Fetch all modifiers from DB, ordered by sortOrder */
export function getModifiers(): MaterialModifier[] {
  return db
    .select({
      id: modifiers.id,
      name: modifiers.name,
      suffix: modifiers.suffix,
    })
    .from(modifiers)
    .orderBy(asc(modifiers.sortOrder))
    .all();
}
