/**
 * Client-safe material formatting helpers.
 * No DB imports — pure string transformations.
 */

/** Known material ID → display name mappings */
const MATERIAL_NAMES: Record<string, string> = {
  pla: "PLA",
  petg: "PETG",
  abs: "ABS",
  tpu: "TPU",
  asa: "ASA",
  nylon: "Nylon",
  pc: "PC",
  pa6: "PA6",
  paht: "PAHT",
  ppa: "PPA",
};

/** Known modifier ID → display info */
const MODIFIER_INFO: Record<string, { name: string; suffix: string }> = {
  basic: { name: "Basic", suffix: "" },
  matte: { name: "Matte", suffix: "Matte" },
  silk: { name: "Silk", suffix: "Silk" },
  "silk+": { name: "Silk+", suffix: "Silk+" },
  "silk-multi-color": { name: "Silk Multi-Color", suffix: "Silk MC" },
  marble: { name: "Marble", suffix: "Marble" },
  sparkle: { name: "Sparkle", suffix: "Sparkle" },
  metal: { name: "Metal", suffix: "Metal" },
  galaxy: { name: "Galaxy", suffix: "Galaxy" },
  translucent: { name: "Translucent", suffix: "Translucent" },
  "glow-in-dark": { name: "Glow-in-Dark", suffix: "Glow" },
  gradient: { name: "Gradient", suffix: "Gradient" },
  wood: { name: "Wood", suffix: "Wood" },
  "tough+": { name: "Tough+", suffix: "Tough+" },
  aero: { name: "Aero", suffix: "Aero" },
  "carbon-fiber": { name: "Carbon Fiber", suffix: "CF" },
  "glass-fiber": { name: "Glass Fiber", suffix: "GF" },
  hf: { name: "High Flow", suffix: "HF" },
  support: { name: "Support", suffix: "Support" },
  "95a-hf": { name: "95A HF", suffix: "95A HF" },
  "for-ams": { name: "for AMS", suffix: "AMS" },
  "90a": { name: "90A", suffix: "90A" },
  "85a": { name: "85A", suffix: "85A" },
};

/**
 * Format material with optional modifier for display
 * @returns Full display name (e.g., "PLA Carbon Fiber" or "PLA")
 */
export function formatMaterial(
  material: string,
  modifier?: string | null
): string {
  const matName = MATERIAL_NAMES[material] || material.toUpperCase();

  if (!modifier || modifier === "basic") {
    return matName;
  }

  const modInfo = MODIFIER_INFO[modifier];
  const modName = modInfo ? modInfo.name : modifier;

  return `${matName} ${modName}`;
}

/**
 * Format material with optional modifier using short suffix
 * @returns Short display format (e.g., "PLA-CF" or "PLA")
 */
export function getMaterialDisplay(
  material: string,
  modifier?: string | null
): string {
  const matName = MATERIAL_NAMES[material] || material.toUpperCase();

  if (!modifier || modifier === "basic") {
    return matName;
  }

  const modInfo = MODIFIER_INFO[modifier];
  const suffix = modInfo ? modInfo.suffix : modifier;

  return suffix ? `${matName}-${suffix}` : matName;
}
