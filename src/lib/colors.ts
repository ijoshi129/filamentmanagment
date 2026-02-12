/**
 * Bambu Lab Color Palette
 *
 * Complete color definitions organized by category with hex values.
 * Based on Bambu Lab's official filament product line.
 */

export type BambuColor = {
  name: string;      // Display name (e.g., "Bambu Green")
  hex: string;       // Hex color value (e.g., "#00AE42")
};

export type ColorCategory = {
  name: string;           // Category name (e.g., "Basic", "Matte")
  colors: BambuColor[];
};

export const BAMBU_COLOR_PALETTE: ColorCategory[] = [
  {
    name: "Basic",
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
    ],
  },
  {
    name: "Matte",
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
    ],
  },
  {
    name: "Silk",
    colors: [
      { name: "Silk Gold", hex: "#FFD700" },
      { name: "Silk Silver", hex: "#C0C0C0" },
      { name: "Silk Copper", hex: "#B87333" },
      { name: "Silk Bronze", hex: "#CD7F32" },
      { name: "Silk Rose Gold", hex: "#B76E79" },
      { name: "Silk Rainbow", hex: "#9381FF" },
      { name: "Silk Blue", hex: "#4169E1" },
      { name: "Silk Red", hex: "#DC143C" },
      { name: "Silk Green", hex: "#32CD32" },
      { name: "Silk Purple", hex: "#9370DB" },
    ],
  },
  {
    name: "Marble",
    colors: [
      { name: "Marble White", hex: "#F8F8F8" },
      { name: "Marble Black", hex: "#2B2B2B" },
      { name: "Marble Grey", hex: "#8B8B8B" },
      { name: "Marble Blue", hex: "#5A7FA5" },
      { name: "Marble Green", hex: "#6A8B6A" },
    ],
  },
  {
    name: "Glow",
    colors: [
      { name: "Glow in Dark Green", hex: "#7FFF00" },
      { name: "Glow in Dark Blue", hex: "#00BFFF" },
      { name: "Glow in Dark Yellow", hex: "#FFFF00" },
    ],
  },
  {
    name: "Sparkle",
    colors: [
      { name: "Sparkle Silver", hex: "#E8E8E8" },
      { name: "Sparkle Gold", hex: "#FFD700" },
      { name: "Sparkle Blue", hex: "#4682B4" },
      { name: "Sparkle Pink", hex: "#FF69B4" },
      { name: "Sparkle Purple", hex: "#BA55D3" },
    ],
  },
  {
    name: "Support",
    colors: [
      { name: "Support W", hex: "#FAFAFA" },
      { name: "Support G", hex: "#E5E5E5" },
    ],
  },
];

// Flat array helper for dropdowns and searches
export const ALL_BAMBU_COLORS: BambuColor[] = BAMBU_COLOR_PALETTE.flatMap(
  (cat) => cat.colors
);
