/**
 * Material Types and Modifiers
 *
 * Definitions for filament base materials and their modifiers.
 * Used for material selection and display formatting in forms.
 */

export type MaterialType = {
  id: string;          // Lowercase identifier (e.g., "pla", "petg")
  name: string;        // Display name (e.g., "PLA", "PETG")
  description: string; // Brief description
};

export type MaterialModifier = {
  id: string;     // Lowercase identifier (e.g., "cf", "silk")
  name: string;   // Display name (e.g., "Carbon Fiber", "Silk")
  suffix: string; // Short suffix for display (e.g., "CF", "Silk")
};

export const BASE_MATERIALS: MaterialType[] = [
  {
    id: "pla",
    name: "PLA",
    description: "General purpose, easy to print, most common",
  },
  {
    id: "petg",
    name: "PETG",
    description: "Stronger than PLA, heat resistant, food-safe options",
  },
  {
    id: "abs",
    name: "ABS",
    description: "High strength, heat resistant, requires enclosure",
  },
  {
    id: "tpu",
    name: "TPU",
    description: "Flexible, rubber-like, impact resistant",
  },
  {
    id: "asa",
    name: "ASA",
    description: "UV resistant outdoor use, similar to ABS",
  },
  {
    id: "nylon",
    name: "Nylon",
    description: "Strong, durable, slight flexibility",
  },
];

export const MATERIAL_MODIFIERS: MaterialModifier[] = [
  {
    id: "carbon-fiber",
    name: "Carbon Fiber",
    suffix: "CF",
  },
  {
    id: "silk",
    name: "Silk",
    suffix: "Silk",
  },
  {
    id: "matte",
    name: "Matte",
    suffix: "Matte",
  },
  {
    id: "glow-in-dark",
    name: "Glow-in-Dark",
    suffix: "Glow",
  },
  {
    id: "wood-fill",
    name: "Wood-fill",
    suffix: "Wood",
  },
];

/**
 * Format material with optional modifier for display
 * @param material - Material type id (e.g., "pla")
 * @param modifier - Optional modifier id (e.g., "carbon-fiber")
 * @returns Full display name (e.g., "PLA Carbon Fiber" or "PLA")
 */
export function formatMaterial(
  material: string,
  modifier?: string | null
): string {
  const mat = BASE_MATERIALS.find((m) => m.id === material);
  const matName = mat ? mat.name : material.toUpperCase();

  if (!modifier) {
    return matName;
  }

  const mod = MATERIAL_MODIFIERS.find((m) => m.id === modifier);
  const modName = mod ? mod.name : modifier;

  return `${matName} ${modName}`;
}

/**
 * Format material with optional modifier using short suffix
 * @param material - Material type id (e.g., "pla")
 * @param modifier - Optional modifier id (e.g., "carbon-fiber")
 * @returns Short display format (e.g., "PLA-CF" or "PLA")
 */
export function getMaterialDisplay(
  material: string,
  modifier?: string | null
): string {
  const mat = BASE_MATERIALS.find((m) => m.id === material);
  const matName = mat ? mat.name : material.toUpperCase();

  if (!modifier) {
    return matName;
  }

  const mod = MATERIAL_MODIFIERS.find((m) => m.id === modifier);
  const suffix = mod ? mod.suffix : modifier;

  return `${matName}-${suffix}`;
}
