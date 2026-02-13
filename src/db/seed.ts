import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL || "sqlite.db";
const sqlite = new Database(databaseUrl);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema });

// --- Brands ---
const brandData: { id: string; name: string; sortOrder: number }[] = [
  { id: "bambu-lab", name: "Bambu Lab", sortOrder: 0 },
  { id: "hatchbox", name: "Hatchbox", sortOrder: 1 },
  { id: "esun", name: "eSUN", sortOrder: 2 },
  { id: "polymaker", name: "Polymaker", sortOrder: 3 },
  { id: "prusament", name: "Prusament", sortOrder: 4 },
  { id: "overture", name: "Overture", sortOrder: 5 },
  { id: "sunlu", name: "SUNLU", sortOrder: 6 },
  { id: "inland", name: "Inland", sortOrder: 7 },
  { id: "eryone", name: "Eryone", sortOrder: 8 },
  { id: "other", name: "Other", sortOrder: 99 },
];

// --- Materials ---
const materialData: { id: string; name: string; description: string; sortOrder: number }[] = [
  { id: "pla", name: "PLA", description: "General purpose, easy to print, most common", sortOrder: 0 },
  { id: "petg", name: "PETG", description: "Stronger than PLA, heat resistant, food-safe options", sortOrder: 1 },
  { id: "abs", name: "ABS", description: "High strength, heat resistant, requires enclosure", sortOrder: 2 },
  { id: "tpu", name: "TPU", description: "Flexible, rubber-like, impact resistant", sortOrder: 3 },
  { id: "asa", name: "ASA", description: "UV resistant outdoor use, similar to ABS", sortOrder: 4 },
  { id: "nylon", name: "Nylon", description: "Strong, durable, slight flexibility", sortOrder: 5 },
  { id: "pc", name: "PC", description: "Polycarbonate, high impact and heat resistance", sortOrder: 6 },
  { id: "pa6", name: "PA6", description: "Nylon 6, engineering-grade strength", sortOrder: 7 },
  { id: "paht", name: "PAHT", description: "High-temp nylon, extreme heat resistance", sortOrder: 8 },
  { id: "ppa", name: "PPA", description: "Polyphthalamide, chemical and heat resistant", sortOrder: 9 },
];

// --- Modifiers ---
const modifierData: { id: string; name: string; suffix: string; sortOrder: number }[] = [
  { id: "basic", name: "Basic", suffix: "", sortOrder: 0 },
  { id: "matte", name: "Matte", suffix: "Matte", sortOrder: 1 },
  { id: "silk", name: "Silk", suffix: "Silk", sortOrder: 2 },
  { id: "silk+", name: "Silk+", suffix: "Silk+", sortOrder: 3 },
  { id: "silk-multi-color", name: "Silk Multi-Color", suffix: "Silk MC", sortOrder: 4 },
  { id: "marble", name: "Marble", suffix: "Marble", sortOrder: 5 },
  { id: "sparkle", name: "Sparkle", suffix: "Sparkle", sortOrder: 6 },
  { id: "metal", name: "Metal", suffix: "Metal", sortOrder: 7 },
  { id: "galaxy", name: "Galaxy", suffix: "Galaxy", sortOrder: 8 },
  { id: "translucent", name: "Translucent", suffix: "Translucent", sortOrder: 9 },
  { id: "glow-in-dark", name: "Glow-in-Dark", suffix: "Glow", sortOrder: 10 },
  { id: "gradient", name: "Gradient", suffix: "Gradient", sortOrder: 11 },
  { id: "wood", name: "Wood", suffix: "Wood", sortOrder: 12 },
  { id: "tough+", name: "Tough+", suffix: "Tough+", sortOrder: 13 },
  { id: "aero", name: "Aero", suffix: "Aero", sortOrder: 14 },
  { id: "carbon-fiber", name: "Carbon Fiber", suffix: "CF", sortOrder: 15 },
  { id: "glass-fiber", name: "Glass Fiber", suffix: "GF", sortOrder: 16 },
  { id: "hf", name: "High Flow", suffix: "HF", sortOrder: 17 },
  { id: "support", name: "Support", suffix: "Support", sortOrder: 18 },
  { id: "95a-hf", name: "95A HF", suffix: "95A HF", sortOrder: 19 },
  { id: "for-ams", name: "for AMS", suffix: "AMS", sortOrder: 20 },
  { id: "90a", name: "90A", suffix: "90A", sortOrder: 21 },
  { id: "85a", name: "85A", suffix: "85A", sortOrder: 22 },
];

// --- Bambu Lab Catalog Colors ---
type CatalogEntry = {
  brandId: string;
  materialId: string;
  modifierId: string;
  colors: { name: string; hex: string }[];
};

const bambuCatalog: CatalogEntry[] = [
  // ==================== PLA ====================
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "basic",
    colors: [
      { name: "Jade White", hex: "#E8E4D9" },
      { name: "Black", hex: "#000000" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Gray", hex: "#808080" },
      { name: "Light Gray", hex: "#ADB5BD" },
      { name: "Dark Gray", hex: "#343A40" },
      { name: "Red", hex: "#E63946" },
      { name: "Magenta", hex: "#C2185B" },
      { name: "Pink", hex: "#F72585" },
      { name: "Hot Pink", hex: "#FF69B4" },
      { name: "Maroon Red", hex: "#800000" },
      { name: "Beige", hex: "#D4AF7A" },
      { name: "Yellow", hex: "#FFD60A" },
      { name: "Gold", hex: "#FFD700" },
      { name: "Sunflower Yellow", hex: "#FFDA03" },
      { name: "Orange", hex: "#F77F00" },
      { name: "Pumpkin Orange", hex: "#FF6D00" },
      { name: "Bright Green", hex: "#76FF03" },
      { name: "Bambu Green", hex: "#00AE42" },
      { name: "Mistletoe Green", hex: "#2E7D32" },
      { name: "Blue", hex: "#1D3557" },
      { name: "Blue Grey", hex: "#607D8B" },
      { name: "Cyan", hex: "#00B4D8" },
      { name: "Cobalt Blue", hex: "#0047AB" },
      { name: "Turquoise", hex: "#40E0D0" },
      { name: "Purple", hex: "#7209B7" },
      { name: "Indigo Purple", hex: "#4B0082" },
      { name: "Brown", hex: "#7F4F24" },
      { name: "Bronze", hex: "#CD7F32" },
      { name: "Cocoa Brown", hex: "#3E2723" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "matte",
    colors: [
      { name: "Ivory White", hex: "#FFFFF0" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Ash Gray", hex: "#B2BEB5" },
      { name: "Bone White", hex: "#F5F5DC" },
      { name: "Nardo Gray", hex: "#6E6E6E" },
      { name: "Lemon Yellow", hex: "#FFF44F" },
      { name: "Desert Tan", hex: "#D2B48C" },
      { name: "Mandarin Orange", hex: "#FF8C00" },
      { name: "Scarlet Red", hex: "#B71C1C" },
      { name: "Dark Red", hex: "#8B0000" },
      { name: "Sakura Pink", hex: "#FFB7C5" },
      { name: "Terracotta", hex: "#B85042" },
      { name: "Plum", hex: "#5D3A5A" },
      { name: "Lilac Purple", hex: "#B39DDB" },
      { name: "Grass Green", hex: "#4CAF50" },
      { name: "Apple Green", hex: "#8DB600" },
      { name: "Dark Green", hex: "#1B5E20" },
      { name: "Ice Blue", hex: "#99CCFF" },
      { name: "Marine Blue", hex: "#003366" },
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Dark Blue", hex: "#191970" },
      { name: "Latte Brown", hex: "#C49A6C" },
      { name: "Dark Brown", hex: "#4E342E" },
      { name: "Dark Chocolate", hex: "#3E2723" },
      { name: "Caramel", hex: "#A0522D" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "silk+",
    colors: [
      { name: "Gold", hex: "#FFD700" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Titan Gray", hex: "#6E6E6E" },
      { name: "Blue", hex: "#4169E1" },
      { name: "Purple", hex: "#9370DB" },
      { name: "Candy Red", hex: "#DC143C" },
      { name: "Candy Green", hex: "#32CD32" },
      { name: "Rose Gold", hex: "#B76E79" },
      { name: "Baby Blue", hex: "#89CFF0" },
      { name: "Pink", hex: "#FF69B4" },
      { name: "Mint", hex: "#98FF98" },
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "White", hex: "#F8F8FF" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "silk-multi-color",
    colors: [
      { name: "Gilded Rose", hex: "#C78283" },
      { name: "Midnight Blaze", hex: "#1A0A2E" },
      { name: "Neon City", hex: "#FF6EC7" },
      { name: "Blue Hawaii", hex: "#00C3E3" },
      { name: "Velvet Eclipse", hex: "#3D0C4F" },
      { name: "South Beach", hex: "#FF9A76" },
      { name: "Aurora Purple", hex: "#7B2FBE" },
      { name: "Dawn Radiance", hex: "#FFB347" },
      { name: "Mystic Magenta", hex: "#FF00FF" },
      { name: "Phantom Blue", hex: "#191970" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "sparkle",
    colors: [
      { name: "Alpine Green", hex: "#2E8B57" },
      { name: "Slate Gray", hex: "#708090" },
      { name: "Crimson Red", hex: "#DC143C" },
      { name: "Royal Purple", hex: "#7851A9" },
      { name: "Onyx Black", hex: "#0F0F0F" },
      { name: "Classic Gold", hex: "#CFB53B" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "marble",
    colors: [
      { name: "White Marble", hex: "#F8F8F8" },
      { name: "Red Granite", hex: "#8B4513" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "metal",
    colors: [
      { name: "Iridium Gold Metallic", hex: "#DAA520" },
      { name: "Copper Brown Metallic", hex: "#B87333" },
      { name: "Oxide Green Metallic", hex: "#4A7043" },
      { name: "Cobalt Blue Metallic", hex: "#0047AB" },
      { name: "Iron Gray Metallic", hex: "#52595D" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "galaxy",
    colors: [
      { name: "Brown", hex: "#5D4037" },
      { name: "Green", hex: "#2E7D32" },
      { name: "Nebulae", hex: "#1A237E" },
      { name: "Purple", hex: "#6A1B9A" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "translucent",
    colors: [
      { name: "Teal", hex: "#008080" },
      { name: "Blue", hex: "#4169E1" },
      { name: "Purple", hex: "#9370DB" },
      { name: "Orange", hex: "#FF8C00" },
      { name: "Red", hex: "#E63946" },
      { name: "Light Jade", hex: "#00A86B" },
      { name: "Mellow Yellow", hex: "#F8DE7E" },
      { name: "Cherry Pink", hex: "#DE3163" },
      { name: "Ice Blue", hex: "#99CCFF" },
      { name: "Lavender", hex: "#B57EDC" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "glow-in-dark",
    colors: [
      { name: "Glow Green", hex: "#7FFF00" },
      { name: "Glow Yellow", hex: "#FFFF00" },
      { name: "Glow Pink", hex: "#FF69B4" },
      { name: "Glow Blue", hex: "#00BFFF" },
      { name: "Glow Orange", hex: "#FF4500" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "gradient",
    colors: [
      { name: "Arctic Whisper", hex: "#E0F7FA" },
      { name: "Solar Breeze", hex: "#FFF9C4" },
      { name: "Ocean to Meadow", hex: "#4DB6AC" },
      { name: "Pink Citrus", hex: "#FF8A65" },
      { name: "Blueberry Bubblegum", hex: "#CE93D8" },
      { name: "Mint Lime", hex: "#C5E1A5" },
      { name: "Cotton Candy Cloud", hex: "#F8BBD0" },
      { name: "Dusk Glare", hex: "#FF7043" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "wood",
    colors: [
      { name: "Black Walnut", hex: "#3E2723" },
      { name: "Rosewood", hex: "#65000B" },
      { name: "Clay Brown", hex: "#8D6E63" },
      { name: "Classic Birch", hex: "#D7CCC8" },
      { name: "White Oak", hex: "#EFEBE9" },
      { name: "Ochre Yellow", hex: "#C68A00" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "tough+",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Yellow", hex: "#FFD60A" },
      { name: "Orange", hex: "#F77F00" },
      { name: "Gray", hex: "#808080" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Cyan", hex: "#00B4D8" },
      { name: "Black", hex: "#000000" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "aero",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pla", modifierId: "carbon-fiber",
    colors: [
      { name: "Black", hex: "#1C1C1C" },
      { name: "Burgundy Red", hex: "#800020" },
      { name: "Lava Gray", hex: "#585858" },
      { name: "Matcha Green", hex: "#7B8F57" },
      { name: "Jeans Blue", hex: "#476B8A" },
      { name: "Royal Blue", hex: "#002366" },
      { name: "Iris Purple", hex: "#5D3FD3" },
    ],
  },

  // ==================== PETG ====================
  {
    brandId: "bambu-lab", materialId: "petg", modifierId: "basic",
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
    brandId: "bambu-lab", materialId: "petg", modifierId: "hf",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "White", hex: "#FAFAFA" },
      { name: "Gray", hex: "#808080" },
      { name: "Dark Gray", hex: "#404040" },
      { name: "Yellow", hex: "#FFD60A" },
      { name: "Orange", hex: "#FF6D00" },
      { name: "Red", hex: "#CC0000" },
      { name: "Green", hex: "#2E7D32" },
      { name: "Lime Green", hex: "#76FF03" },
      { name: "Forest Green", hex: "#1B5E20" },
      { name: "Blue", hex: "#003399" },
      { name: "Lake Blue", hex: "#4682B4" },
      { name: "Peanut Brown", hex: "#795548" },
      { name: "Cream", hex: "#FFFDD0" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "petg", modifierId: "translucent",
    colors: [
      { name: "Clear", hex: "#F0F0F0" },
      { name: "Gray", hex: "#A0A0A0" },
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Olive", hex: "#808000" },
      { name: "Brown", hex: "#8D6E63" },
      { name: "Teal", hex: "#008080" },
      { name: "Orange", hex: "#FF8C00" },
      { name: "Purple", hex: "#9370DB" },
      { name: "Pink", hex: "#FF69B4" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "petg", modifierId: "carbon-fiber",
    colors: [
      { name: "Black", hex: "#1C1C1C" },
      { name: "Titan Gray", hex: "#6E6E6E" },
      { name: "Brick Red", hex: "#CB4154" },
      { name: "Malachite Green", hex: "#0BDA51" },
      { name: "Indigo Blue", hex: "#4B0082" },
      { name: "Violet Purple", hex: "#7F00FF" },
    ],
  },

  // ==================== ABS ====================
  {
    brandId: "bambu-lab", materialId: "abs", modifierId: "basic",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "White", hex: "#F5F5F5" },
      { name: "Red", hex: "#CC0000" },
      { name: "Blue", hex: "#003399" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Bambu Green", hex: "#00AE42" },
      { name: "Orange", hex: "#FF6D00" },
      { name: "Navy Blue", hex: "#000080" },
      { name: "Azure", hex: "#007FFF" },
      { name: "Olive", hex: "#808000" },
      { name: "Tangerine Yellow", hex: "#FFCC00" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "abs", modifierId: "glass-fiber",
    colors: [
      { name: "White", hex: "#F5F5F5" },
      { name: "Gray", hex: "#808080" },
      { name: "Orange", hex: "#FF6D00" },
      { name: "Red", hex: "#CC0000" },
      { name: "Blue", hex: "#003399" },
      { name: "Black", hex: "#0A0A0A" },
    ],
  },

  // ==================== ASA ====================
  {
    brandId: "bambu-lab", materialId: "asa", modifierId: "basic",
    colors: [
      { name: "White", hex: "#F5F5F5" },
      { name: "Gray", hex: "#808080" },
      { name: "Black", hex: "#0A0A0A" },
      { name: "Red", hex: "#CC0000" },
      { name: "Green", hex: "#2E7D32" },
      { name: "Blue", hex: "#003399" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "asa", modifierId: "aero",
    colors: [
      { name: "White", hex: "#FFFFFF" },
    ],
  },

  // ==================== TPU ====================
  {
    brandId: "bambu-lab", materialId: "tpu", modifierId: "95a-hf",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Yellow", hex: "#FFD60A" },
      { name: "Blue", hex: "#003399" },
      { name: "Red", hex: "#CC0000" },
      { name: "Gray", hex: "#808080" },
      { name: "Black", hex: "#0A0A0A" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "tpu", modifierId: "for-ams",
    colors: [
      { name: "Red", hex: "#CC0000" },
      { name: "Yellow", hex: "#FFD60A" },
      { name: "Blue", hex: "#003399" },
      { name: "Neon Green", hex: "#39FF14" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" },
      { name: "Black", hex: "#0A0A0A" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "tpu", modifierId: "90a",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#0A0A0A" },
      { name: "Quicksilver", hex: "#A6A6A6" },
      { name: "Frozen", hex: "#D6F0FF" },
      { name: "Blaze", hex: "#FF4500" },
      { name: "Neon Orange", hex: "#FF6700" },
      { name: "Light Cyan", hex: "#E0FFFF" },
      { name: "Grape Jelly", hex: "#6B3FA0" },
      { name: "Crystal Blue", hex: "#68A0D0" },
      { name: "Cocoa Brown", hex: "#3E2723" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "tpu", modifierId: "85a",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "Neon Orange", hex: "#FF6700" },
      { name: "Light Cyan", hex: "#E0FFFF" },
      { name: "Flesh", hex: "#FFCBA4" },
      { name: "Lime Green", hex: "#32CD32" },
    ],
  },

  // ==================== PC ====================
  {
    brandId: "bambu-lab", materialId: "pc", modifierId: "basic",
    colors: [
      { name: "Clear Black", hex: "#1C1C1C" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Transparent", hex: "#E8E8E8" },
      { name: "Black", hex: "#0A0A0A" },
    ],
  },

  // ==================== PA6 ====================
  {
    brandId: "bambu-lab", materialId: "pa6", modifierId: "carbon-fiber",
    colors: [
      { name: "Black", hex: "#1C1C1C" },
    ],
  },
  {
    brandId: "bambu-lab", materialId: "pa6", modifierId: "glass-fiber",
    colors: [
      { name: "Black", hex: "#1C1C1C" },
    ],
  },

  // ==================== PAHT ====================
  {
    brandId: "bambu-lab", materialId: "paht", modifierId: "carbon-fiber",
    colors: [
      { name: "Black", hex: "#1C1C1C" },
    ],
  },

  // ==================== PPA ====================
  {
    brandId: "bambu-lab", materialId: "ppa", modifierId: "carbon-fiber",
    colors: [
      { name: "Black", hex: "#1C1C1C" },
    ],
  },
];

async function seed() {
  console.log("Seeding database...");

  // Clear existing catalog data
  db.delete(schema.catalogColors).run();
  db.delete(schema.brands).run();
  db.delete(schema.materials).run();
  db.delete(schema.modifiers).run();

  // Insert brands
  for (const brand of brandData) {
    db.insert(schema.brands).values(brand).run();
  }
  console.log(`  Inserted ${brandData.length} brands`);

  // Insert materials
  for (const material of materialData) {
    db.insert(schema.materials).values(material).run();
  }
  console.log(`  Inserted ${materialData.length} materials`);

  // Insert modifiers
  for (const modifier of modifierData) {
    db.insert(schema.modifiers).values(modifier).run();
  }
  console.log(`  Inserted ${modifierData.length} modifiers`);

  // Insert catalog colors
  let colorCount = 0;
  for (const entry of bambuCatalog) {
    for (let i = 0; i < entry.colors.length; i++) {
      const color = entry.colors[i];
      db.insert(schema.catalogColors).values({
        id: crypto.randomUUID(),
        brandId: entry.brandId,
        materialId: entry.materialId,
        modifierId: entry.modifierId,
        colorName: color.name,
        colorHex: color.hex,
        sortOrder: i,
      }).run();
      colorCount++;
    }
  }
  console.log(`  Inserted ${colorCount} catalog colors`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
