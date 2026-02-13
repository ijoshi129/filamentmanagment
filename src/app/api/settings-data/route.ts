import { NextResponse } from "next/server";
import { getBrands, getMaterials, getModifiers } from "@/lib/materials";

export async function GET() {
  const brands = getBrands();
  const materials = getMaterials();
  const modifiers = getModifiers();

  return NextResponse.json({ brands, materials, modifiers });
}
