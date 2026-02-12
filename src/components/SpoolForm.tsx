"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BAMBU_COLOR_PALETTE } from "@/lib/colors";
import { BASE_MATERIALS, MATERIAL_MODIFIERS } from "@/lib/materials";
import { createSpoolSchema, type CreateSpoolInput } from "@/lib/validations";
import type { Spool } from "@/db/schema";
import type { ZodIssue } from "zod";

type ActionResult =
  | ({ success: true } & { spool: Spool })
  | { success: false; error: string };

type SpoolFormProps = {
  initialData?: Partial<Spool>;
  onSubmit: (data: CreateSpoolInput) => Promise<ActionResult>;
  submitLabel?: string;
};

export function SpoolForm({
  initialData,
  onSubmit,
  submitLabel = "Add Spool",
}: SpoolFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [material, setMaterial] = useState(initialData?.material ?? "");
  const [modifier, setModifier] = useState(initialData?.modifier ?? "");
  const [colorName, setColorName] = useState(initialData?.colorName ?? "");
  const [colorHex, setColorHex] = useState(initialData?.colorHex ?? "");
  const [purchaseDate, setPurchaseDate] = useState(
    initialData?.purchaseDate ?? ""
  );
  const [initialWeight, setInitialWeight] = useState(
    initialData?.initialWeight ?? 1000
  );
  const [price, setPrice] = useState<string>(
    initialData?.price?.toString() ?? ""
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  // Field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Handle color swatch click
  const handleColorSelect = (name: string, hex: string) => {
    setColorName(name);
    setColorHex(hex);
    // Clear color errors
    setFieldErrors((prev) => {
      const { colorName: _, colorHex: __, ...rest } = prev;
      return rest;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Prepare form data
    const formData = {
      brand,
      material,
      modifier: modifier || null,
      colorName,
      colorHex,
      initialWeight,
      purchaseDate: purchaseDate || null,
      price: price ? parseFloat(price) : null,
      notes: notes || null,
    };

    // Validate with Zod (will add default status)
    const validation = createSpoolSchema.safeParse(formData);

    if (!validation.success) {
      // Extract field errors
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    // Submit
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {/* Brand */}
      <div className="space-y-1">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
          Brand <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., Bambu Lab, Hatchbox, eSUN"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {fieldErrors.brand && (
          <p className="text-sm text-red-600">{fieldErrors.brand}</p>
        )}
      </div>

      {/* Material */}
      <div className="space-y-1">
        <label htmlFor="material" className="block text-sm font-medium text-gray-700">
          Material <span className="text-red-500">*</span>
        </label>
        <select
          id="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select material...</option>
          {BASE_MATERIALS.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.name} - {mat.description}
            </option>
          ))}
        </select>
        {fieldErrors.material && (
          <p className="text-sm text-red-600">{fieldErrors.material}</p>
        )}
      </div>

      {/* Modifier */}
      <div className="space-y-1">
        <label htmlFor="modifier" className="block text-sm font-medium text-gray-700">
          Modifier (Optional)
        </label>
        <select
          id="modifier"
          value={modifier}
          onChange={(e) => setModifier(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">None</option>
          {MATERIAL_MODIFIERS.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Color <span className="text-red-500">*</span>
        </label>

        {/* Bambu Lab Palette */}
        <div className="space-y-4 rounded-md border border-gray-300 p-4 bg-gray-50">
          <p className="text-xs font-medium text-gray-600">Bambu Lab Palette</p>
          {BAMBU_COLOR_PALETTE.map((category) => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-700">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleColorSelect(color.name, color.hex)}
                    className={`h-8 w-8 rounded border-2 transition-all hover:scale-110 ${
                      colorHex === color.hex
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current Selection */}
        {colorName && colorHex && (
          <div className="flex items-center gap-3 rounded-md border border-gray-300 p-3 bg-white">
            <div
              className="h-10 w-10 rounded border border-gray-300"
              style={{ backgroundColor: colorHex }}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{colorName}</p>
              <p className="text-xs text-gray-500">{colorHex}</p>
            </div>
          </div>
        )}

        {/* Manual Override */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">
            Or enter custom color:
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Color name"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {fieldErrors.colorHex && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.colorHex}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Date */}
      <div className="space-y-1">
        <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
          Purchase Date (Optional)
        </label>
        <input
          type="date"
          id="purchaseDate"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Initial Weight */}
      <div className="space-y-1">
        <label htmlFor="initialWeight" className="block text-sm font-medium text-gray-700">
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
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">g</span>
        </div>
        {fieldErrors.initialWeight && (
          <p className="text-sm text-red-600">{fieldErrors.initialWeight}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price (Optional)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">$</span>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 text-right">
          {notes.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Adding..." : submitLabel}
      </button>
    </form>
  );
}
