"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCatalogColors, getCatalogModifiers } from "@/actions/settings";
import { createSpoolSchema, SPOOL_STATUSES, type CreateSpoolInput } from "@/lib/validations";
import type { Spool } from "@/db/schema";
import type { ZodIssue } from "zod";

type FilamentColor = { name: string; hex: string };

type ActionResult =
  | ({ success: true } & { spool: Spool })
  | { success: false; error: string };

type BrandOption = { id: string; name: string };
type MaterialOption = { id: string; name: string; description: string | null };
type ModifierOption = { id: string; name: string; suffix: string };

type SpoolFormProps = {
  initialData?: Partial<Spool>;
  onSubmit: (data: CreateSpoolInput) => Promise<ActionResult>;
  submitLabel?: string;
  brands: BrandOption[];
  materials: MaterialOption[];
  allModifiers: ModifierOption[];
};

export function SpoolForm({
  initialData,
  onSubmit,
  submitLabel = "Add Spool",
  brands,
  materials,
  allModifiers,
}: SpoolFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [material, setMaterial] = useState(initialData?.material ?? "");
  const [modifier, setModifier] = useState(initialData?.modifier ?? "");
  const [colorName, setColorName] = useState(initialData?.colorName ?? "");
  const [colorHex, setColorHex] = useState(initialData?.colorHex ?? "");
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate ?? "");
  const [initialWeight, setInitialWeight] = useState(initialData?.initialWeight ?? 1000);
  const [price, setPrice] = useState<string>(initialData?.price?.toString() ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "in_use");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Dynamic state from server
  const [availableModifierIds, setAvailableModifierIds] = useState<string[]>([]);
  const [colors, setColors] = useState<FilamentColor[]>([]);
  const [brandHasCatalog, setBrandHasCatalog] = useState(false);

  // Find the selected brand's ID from its name
  const selectedBrandId = useMemo(() => {
    const b = brands.find((b) => b.name === brand);
    return b?.id ?? "";
  }, [brand, brands]);

  // Fetch available modifiers when brand+material changes
  useEffect(() => {
    if (!selectedBrandId || !material) {
      setAvailableModifierIds([]);
      setBrandHasCatalog(false);
      return;
    }
    getCatalogModifiers(selectedBrandId, material).then((ids) => {
      setAvailableModifierIds(ids);
      setBrandHasCatalog(ids.length > 0);
    });
  }, [selectedBrandId, material]);

  // Fetch colors when brand+material+modifier changes
  useEffect(() => {
    if (!selectedBrandId || !material || !modifier) {
      setColors([]);
      return;
    }
    getCatalogColors(selectedBrandId, material, modifier).then(setColors);
  }, [selectedBrandId, material, modifier]);

  // Filter modifier options: if brand has catalog data, only show matching modifiers
  const modifierOptions = useMemo(() => {
    if (!brand || !material) return [];
    if (brandHasCatalog && availableModifierIds.length > 0) {
      return allModifiers.filter((m) => availableModifierIds.includes(m.id));
    }
    // No catalog data — show all modifiers
    return allModifiers;
  }, [brand, material, brandHasCatalog, availableModifierIds, allModifiers]);

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    setModifier("");
    setColorName("");
    setColorHex("");
  };

  const handleMaterialChange = (newMaterial: string) => {
    setMaterial(newMaterial);
    setModifier("");
    setColorName("");
    setColorHex("");
  };

  const handleModifierChange = (newModifier: string) => {
    setModifier(newModifier);
    setColorName("");
    setColorHex("");
  };

  const handleColorSelect = (name: string, hex: string) => {
    setColorName(name);
    setColorHex(hex);
    setFieldErrors((prev) => {
      const { colorName: _, colorHex: __, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = {
      brand,
      material,
      modifier,
      colorName,
      colorHex,
      status,
      initialWeight,
      purchaseDate: purchaseDate || null,
      price: price ? parseFloat(price) : null,
      notes: notes || null,
    };

    const validation = createSpoolSchema.safeParse(formData);

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(validation.data);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isLightColor = (hex: string) => {
    // Parse hex to RGB and check luminance
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.75;
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-800 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {/* Brand & Material */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            id="brand"
            value={brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Select brand...</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          {fieldErrors.brand && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.brand}</p>
          )}
        </div>

        <div>
          <label htmlFor="material" className={labelClass}>
            Material <span className="text-red-500">*</span>
          </label>
          <select
            id="material"
            value={material}
            onChange={(e) => handleMaterialChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Select material...</option>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name}
              </option>
            ))}
          </select>
          {fieldErrors.material && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.material}</p>
          )}
        </div>
      </div>

      {/* Modifier — only shows after brand + material selected */}
      {brand && material && (
        <div>
          <label htmlFor="modifier" className={labelClass}>
            Type <span className="text-red-500">*</span>
          </label>
          {modifierOptions.length > 0 ? (
            <select
              id="modifier"
              value={modifier}
              onChange={(e) => handleModifierChange(e.target.value)}
              className={inputClass}
            >
              <option value="">Select type...</option>
              {modifierOptions.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              No known product lines for {brand} {materials.find(m => m.id === material)?.name}. Enter modifier and color manually below.
            </div>
          )}
          {fieldErrors.modifier && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.modifier}</p>
          )}
        </div>
      )}

      {/* Color Picker */}
      <div>
        <label className={labelClass}>
          Color <span className="text-red-500">*</span>
        </label>

        {/* Palette swatches */}
        {colors.length > 0 && (
          <div className="rounded-xl border border-gray-200 p-5 bg-gray-50 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {brand} {materials.find(m => m.id === material)?.name}{" "}
              {allModifiers.find(m => m.id === modifier)?.name} Colors
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
              {colors.map((color) => {
                const isSelected = colorHex === color.hex && colorName === color.name;
                const isHovered = hoveredColor === color.name;
                return (
                  <div
                    key={color.name}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
                  >
                    <button
                      type="button"
                      onClick={() => handleColorSelect(color.name, color.hex)}
                      onMouseEnter={() => setHoveredColor(color.name)}
                      onMouseLeave={() => setHoveredColor(null)}
                      title={color.name}
                      aria-label={color.name}
                      style={{
                        width: isHovered ? "76px" : "60px",
                        height: isHovered ? "76px" : "60px",
                        minWidth: isHovered ? "76px" : "60px",
                        backgroundColor: color.hex,
                        borderRadius: "14px",
                        border: isSelected
                          ? "3px solid #3b82f6"
                          : isLightColor(color.hex)
                          ? "2px solid #d1d5db"
                          : "2px solid transparent",
                        boxShadow: isSelected
                          ? "0 0 0 3px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.15)"
                          : isHovered
                          ? "0 6px 20px rgba(0,0,0,0.3)"
                          : "0 1px 4px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        position: "relative",
                        zIndex: isHovered ? 10 : 1,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        textAlign: "center",
                        maxWidth: "70px",
                        lineHeight: "1.2",
                      }}
                    >
                      {color.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Guidance messages */}
        {!brand && (
          <div className="rounded-xl border border-dashed border-gray-300 p-5 bg-gray-50/50 text-sm text-gray-500 mb-4 text-center">
            Select a brand, material, and type to see available colors
          </div>
        )}

        {brand && !material && (
          <div className="rounded-xl border border-dashed border-gray-300 p-5 bg-gray-50/50 text-sm text-gray-500 mb-4 text-center">
            Select a material and type to see available colors
          </div>
        )}

        {brand && material && !modifier && (
          <div className="rounded-xl border border-dashed border-gray-300 p-5 bg-gray-50/50 text-sm text-gray-500 mb-4 text-center">
            Select a type to see available colors
          </div>
        )}

        {brand && material && modifier && colors.length === 0 && (
          <div className="rounded-xl border border-gray-200 p-5 bg-gray-50 text-sm text-gray-600 mb-4">
            No preset palette for this combination. Enter color manually below.
          </div>
        )}

        {/* Current Selection */}
        {colorName && colorHex && (
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 bg-white shadow-sm mb-4">
            <div
              style={{
                width: "48px",
                height: "48px",
                minWidth: "48px",
                borderRadius: "10px",
                backgroundColor: colorHex,
                border: isLightColor(colorHex) ? "1px solid #d1d5db" : "none",
              }}
            />
            <div>
              <p className="text-base font-semibold text-gray-900">{colorName}</p>
              <p className="text-sm text-gray-500 font-mono">{colorHex}</p>
            </div>
          </div>
        )}

        {/* Manual color input */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {colors.length > 0 ? "Or enter custom color" : "Enter color"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Color name"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.colorName && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.colorName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="#000000"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.colorHex && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.colorHex}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className={labelClass}>
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputClass}
        >
          {SPOOL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "sealed" ? "Sealed" : s === "in_use" ? "Open" : "Empty"}
            </option>
          ))}
        </select>
      </div>

      {/* Weight & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="initialWeight" className={labelClass}>
            Initial Weight <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="initialWeight"
              value={initialWeight}
              onChange={(e) => setInitialWeight(parseInt(e.target.value) || 0)}
              min="1"
              step="1"
              className={inputClass + " flex-1"}
            />
            <span className="text-sm font-medium text-gray-500">g</span>
          </div>
          {fieldErrors.initialWeight && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.initialWeight}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>
            Price <span className="text-gray-400">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">$</span>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
              className={inputClass + " flex-1"}
            />
          </div>
        </div>
      </div>

      {/* Purchase Date */}
      <div>
        <label htmlFor="purchaseDate" className={labelClass}>
          Purchase Date <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="date"
          id="purchaseDate"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Any additional notes about this filament..."
          className={inputClass + " resize-none"}
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {notes.length}/500
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
