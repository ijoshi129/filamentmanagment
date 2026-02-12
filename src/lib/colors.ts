/**
 * Brand Color Catalogs
 *
 * Actual product lines organized by brand → material → modifier → colors.
 * Only combinations that exist in reality are listed.
 */

export type FilamentColor = {
  name: string;
  hex: string;
};

export type ModifierColors = {
  modifierId: string;
  colors: FilamentColor[];
};

export type MaterialColors = {
  materialId: string;
  modifiers: ModifierColors[];
};

export type BrandCatalog = {
  brandName: string;
  materials: MaterialColors[];
};

export const BRAND_CATALOGS: BrandCatalog[] = [
  {
    brandName: "Bambu Lab",
    materials: [
      {
        materialId: "pla",
        modifiers: [
          {
            modifierId: "basic",
            colors: [
              { name: "Black", hex: "#000000" },
              { name: "White", hex: "#FFFFFF" },
              { name: "Bambu Green", hex: "#00AE42" },
              { name: "Red", hex: "#E63946" },
              { name: "Blue", hex: "#1D3557" },
              { name: "Yellow", hex: "#FFD60A" },
              { name: "Orange", hex: "#F77F00" },
              { name: "Grey", hex: "#6C757D" },
              { name: "Light Blue", hex: "#48CAE4" },
              { name: "Pink", hex: "#F72585" },
              { name: "Purple", hex: "#7209B7" },
              { name: "Brown", hex: "#7F4F24" },
              { name: "Light Grey", hex: "#ADB5BD" },
              { name: "Dark Grey", hex: "#343A40" },
              { name: "Jade White", hex: "#E8E4D9" },
              { name: "Cyan", hex: "#00B4D8" },
              { name: "Scarlet Red", hex: "#B71C1C" },
              { name: "Olive Green", hex: "#556B2F" },
              { name: "Savannah Yellow", hex: "#E8A317" },
            ],
          },
          {
            modifierId: "matte",
            colors: [
              { name: "Matte Black", hex: "#1A1A1A" },
              { name: "Matte White", hex: "#F5F5F5" },
              { name: "Matte Charcoal", hex: "#36454F" },
              { name: "Matte Army Green", hex: "#4B5320" },
              { name: "Matte Midnight Blue", hex: "#191970" },
              { name: "Matte Terracotta", hex: "#B85042" },
              { name: "Matte Beige", hex: "#D4AF7A" },
              { name: "Matte Dark Grey", hex: "#4A4A4A" },
              { name: "Matte Purple", hex: "#5D3A5A" },
              { name: "Matte Crimson", hex: "#990000" },
              { name: "Matte Sakura Pink", hex: "#FFB7C5" },
              { name: "Matte Lilac Purple", hex: "#B39DDB" },
            ],
          },
          {
            modifierId: "silk",
            colors: [
              { name: "Silk Gold", hex: "#FFD700" },
              { name: "Silk Silver", hex: "#C0C0C0" },
              { name: "Silk Copper", hex: "#B87333" },
              { name: "Silk Bronze", hex: "#CD7F32" },
              { name: "Silk Rose Gold", hex: "#B76E79" },
              { name: "Silk Blue", hex: "#4169E1" },
              { name: "Silk Red", hex: "#DC143C" },
              { name: "Silk Green", hex: "#32CD32" },
              { name: "Silk Purple", hex: "#9370DB" },
            ],
          },
          {
            modifierId: "marble",
            colors: [
              { name: "Marble White", hex: "#F8F8F8" },
              { name: "Marble Black", hex: "#2B2B2B" },
              { name: "Marble Grey", hex: "#8B8B8B" },
            ],
          },
          {
            modifierId: "glow-in-dark",
            colors: [
              { name: "Glow Green", hex: "#7FFF00" },
              { name: "Glow Blue", hex: "#00BFFF" },
            ],
          },
          {
            modifierId: "sparkle",
            colors: [
              { name: "Sparkle Silver", hex: "#E8E8E8" },
              { name: "Sparkle Gold", hex: "#FFD700" },
              { name: "Sparkle Blue", hex: "#4682B4" },
              { name: "Sparkle Pink", hex: "#FF69B4" },
              { name: "Sparkle Purple", hex: "#BA55D3" },
            ],
          },
          {
            modifierId: "carbon-fiber",
            colors: [
              { name: "Black", hex: "#1C1C1C" },
            ],
          },
        ],
      },
      {
        materialId: "petg",
        modifiers: [
          {
            modifierId: "basic",
            colors: [
              { name: "Black", hex: "#0A0A0A" },
              { name: "White", hex: "#FAFAFA" },
              { name: "Grey", hex: "#808080" },
              { name: "Translucent", hex: "#E0E0E0" },
              { name: "Red", hex: "#CC0000" },
              { name: "Blue", hex: "#003399" },
              { name: "Orange", hex: "#E65100" },
              { name: "Green", hex: "#2E7D32" },
            ],
          },
          {
            modifierId: "carbon-fiber",
            colors: [
              { name: "Black", hex: "#1C1C1C" },
            ],
          },
        ],
      },
      {
        materialId: "abs",
        modifiers: [
          {
            modifierId: "basic",
            colors: [
              { name: "Black", hex: "#0A0A0A" },
              { name: "White", hex: "#F5F5F5" },
              { name: "Red", hex: "#CC0000" },
              { name: "Grey", hex: "#808080" },
              { name: "Blue", hex: "#003399" },
            ],
          },
        ],
      },
      {
        materialId: "asa",
        modifiers: [
          {
            modifierId: "basic",
            colors: [
              { name: "Black", hex: "#0A0A0A" },
              { name: "White", hex: "#F5F5F5" },
              { name: "Red", hex: "#CC0000" },
              { name: "Grey", hex: "#808080" },
            ],
          },
        ],
      },
      {
        materialId: "tpu",
        modifiers: [
          {
            modifierId: "basic",
            colors: [
              { name: "Black", hex: "#0A0A0A" },
              { name: "White", hex: "#F5F5F5" },
              { name: "Red", hex: "#CC0000" },
            ],
          },
        ],
      },
      {
        materialId: "nylon",
        modifiers: [
          {
            modifierId: "basic",
            colors: [
              { name: "Natural", hex: "#E8DCC8" },
            ],
          },
          {
            modifierId: "carbon-fiber",
            colors: [
              { name: "Black", hex: "#1C1C1C" },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Get available modifiers for a brand + material combination.
 * Returns modifier IDs that actually exist in the catalog.
 */
export function getAvailableModifiers(
  brandName: string,
  materialId: string
): string[] {
  const brand = BRAND_CATALOGS.find((b) => b.brandName === brandName);
  if (!brand) return [];

  const material = brand.materials.find((m) => m.materialId === materialId);
  if (!material) return [];

  return material.modifiers.map((m) => m.modifierId);
}

/**
 * Get colors for a specific brand + material + modifier combination.
 */
export function getColors(
  brandName: string,
  materialId: string,
  modifierId: string
): FilamentColor[] {
  const brand = BRAND_CATALOGS.find((b) => b.brandName === brandName);
  if (!brand) return [];

  const material = brand.materials.find((m) => m.materialId === materialId);
  if (!material) return [];

  const modifier = material.modifiers.find((m) => m.modifierId === modifierId);
  if (!modifier) return [];

  return modifier.colors;
}

/**
 * Check if a brand has catalog data.
 */
export function hasCatalog(brandName: string): boolean {
  return BRAND_CATALOGS.some((b) => b.brandName === brandName);
}
