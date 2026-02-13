"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  addBrand, updateBrand, deleteBrand,
  addMaterial, updateMaterial, deleteMaterial,
  addModifier, updateModifier, deleteModifier,
  addCatalogColor, deleteCatalogColor, getCatalogColorsWithIds, getCatalogModifiers,
} from "@/actions/settings";

type Brand = { id: string; name: string };
type Material = { id: string; name: string; description: string | null };
type Modifier = { id: string; name: string; suffix: string };
type CatalogColorRow = {
  id: string;
  brandId: string;
  materialId: string;
  modifierId: string;
  colorName: string;
  colorHex: string;
  sortOrder: number;
};

type Tab = "brands" | "materials" | "modifiers" | "colors";

function useInitialData() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // These are synchronous DB calls wrapped in a fetch
    // We'll use server actions to load them
    fetch("/api/settings-data")
      .then((r) => r.json())
      .then((data) => {
        setBrands(data.brands);
        setMaterials(data.materials);
        setModifiers(data.modifiers);
        setLoaded(true);
      });
  }, []);

  return { brands, setBrands, materials, setMaterials, modifiers, setModifiers, loaded };
}

export default function SettingsPage() {
  const { brands, setBrands, materials, setMaterials, modifiers, setModifiers, loaded } = useInitialData();
  const [activeTab, setActiveTab] = useState<Tab>("brands");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "brands", label: "Brands" },
    { id: "materials", label: "Materials" },
    { id: "modifiers", label: "Modifiers" },
    { id: "colors", label: "Color Catalog" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage brands, materials, modifiers, and color catalogs.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-lg p-3 text-sm mb-4 border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {activeTab === "brands" && (
            <BrandsSection brands={brands} setBrands={setBrands} showMessage={showMessage} />
          )}
          {activeTab === "materials" && (
            <MaterialsSection materials={materials} setMaterials={setMaterials} showMessage={showMessage} />
          )}
          {activeTab === "modifiers" && (
            <ModifiersSection modifiers={modifiers} setModifiers={setModifiers} showMessage={showMessage} />
          )}
          {activeTab === "colors" && (
            <ColorsSection brands={brands} materials={materials} modifiers={modifiers} showMessage={showMessage} />
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== Brands Section ====================
function BrandsSection({
  brands,
  setBrands,
  showMessage,
}: {
  brands: Brand[];
  setBrands: (b: Brand[]) => void;
  showMessage: (type: "success" | "error", text: string) => void;
}) {
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = async () => {
    if (!newId.trim() || !newName.trim()) return;
    const result = await addBrand(newId.trim().toLowerCase(), newName.trim());
    if (result.success) {
      setBrands([...brands, { id: newId.trim().toLowerCase(), name: newName.trim() }]);
      setNewId("");
      setNewName("");
      showMessage("success", `Brand "${newName.trim()}" added`);
    } else {
      showMessage("error", result.error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const result = await updateBrand(id, editName.trim());
    if (result.success) {
      setBrands(brands.map((b) => (b.id === id ? { ...b, name: editName.trim() } : b)));
      setEditingId(null);
      showMessage("success", "Brand updated");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"? This will also remove all its catalog colors.`)) return;
    const result = await deleteBrand(id);
    if (result.success) {
      setBrands(brands.filter((b) => b.id !== id));
      showMessage("success", `Brand "${name}" deleted`);
    } else {
      showMessage("error", result.error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Brands</h2>

      {/* Add form */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="ID (e.g., bambu-lab)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Display name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            {editingId === brand.id ? (
              <>
                <span className="text-xs text-gray-400 font-mono w-24">{brand.id}</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(brand.id)}
                />
                <button onClick={() => handleUpdate(brand.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Save</button>
                <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400 font-mono w-24">{brand.id}</span>
                <span className="flex-1 text-sm text-gray-900">{brand.name}</span>
                <button
                  onClick={() => { setEditingId(brand.id); setEditName(brand.name); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Materials Section ====================
function MaterialsSection({
  materials,
  setMaterials,
  showMessage,
}: {
  materials: Material[];
  setMaterials: (m: Material[]) => void;
  showMessage: (type: "success" | "error", text: string) => void;
}) {
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleAdd = async () => {
    if (!newId.trim() || !newName.trim()) return;
    const result = await addMaterial(newId.trim().toLowerCase(), newName.trim(), newDesc.trim());
    if (result.success) {
      setMaterials([...materials, { id: newId.trim().toLowerCase(), name: newName.trim(), description: newDesc.trim() }]);
      setNewId("");
      setNewName("");
      setNewDesc("");
      showMessage("success", `Material "${newName.trim()}" added`);
    } else {
      showMessage("error", result.error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const result = await updateMaterial(id, editName.trim(), editDesc.trim());
    if (result.success) {
      setMaterials(materials.map((m) => (m.id === id ? { ...m, name: editName.trim(), description: editDesc.trim() } : m)));
      setEditingId(null);
      showMessage("success", "Material updated");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete material "${name}"? This will also remove associated catalog colors.`)) return;
    const result = await deleteMaterial(id);
    if (result.success) {
      setMaterials(materials.filter((m) => m.id !== id));
      showMessage("success", `Material "${name}" deleted`);
    } else {
      showMessage("error", result.error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Materials</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="ID (e.g., pla)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-32"
        />
        <input
          type="text"
          placeholder="Display name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-32"
        />
        <input
          type="text"
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm min-w-48"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {materials.map((mat) => (
          <div key={mat.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            {editingId === mat.id ? (
              <>
                <span className="text-xs text-gray-400 font-mono w-16">{mat.id}</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button onClick={() => handleUpdate(mat.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Save</button>
                <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400 font-mono w-16">{mat.id}</span>
                <span className="text-sm font-medium text-gray-900 w-16">{mat.name}</span>
                <span className="flex-1 text-sm text-gray-500">{mat.description}</span>
                <button
                  onClick={() => { setEditingId(mat.id); setEditName(mat.name); setEditDesc(mat.description ?? ""); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mat.id, mat.name)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Modifiers Section ====================
function ModifiersSection({
  modifiers,
  setModifiers,
  showMessage,
}: {
  modifiers: Modifier[];
  setModifiers: (m: Modifier[]) => void;
  showMessage: (type: "success" | "error", text: string) => void;
}) {
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newSuffix, setNewSuffix] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSuffix, setEditSuffix] = useState("");

  const handleAdd = async () => {
    if (!newId.trim() || !newName.trim()) return;
    const result = await addModifier(newId.trim().toLowerCase(), newName.trim(), newSuffix.trim());
    if (result.success) {
      setModifiers([...modifiers, { id: newId.trim().toLowerCase(), name: newName.trim(), suffix: newSuffix.trim() }]);
      setNewId("");
      setNewName("");
      setNewSuffix("");
      showMessage("success", `Modifier "${newName.trim()}" added`);
    } else {
      showMessage("error", result.error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const result = await updateModifier(id, editName.trim(), editSuffix.trim());
    if (result.success) {
      setModifiers(modifiers.map((m) => (m.id === id ? { ...m, name: editName.trim(), suffix: editSuffix.trim() } : m)));
      setEditingId(null);
      showMessage("success", "Modifier updated");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete modifier "${name}"? This will also remove associated catalog colors.`)) return;
    const result = await deleteModifier(id);
    if (result.success) {
      setModifiers(modifiers.filter((m) => m.id !== id));
      showMessage("success", `Modifier "${name}" deleted`);
    } else {
      showMessage("error", result.error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Modifiers</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="ID (e.g., silk)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-36"
        />
        <input
          type="text"
          placeholder="Display name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Suffix (e.g., CF)"
          value={newSuffix}
          onChange={(e) => setNewSuffix(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-28"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {modifiers.map((mod) => (
          <div key={mod.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            {editingId === mod.id ? (
              <>
                <span className="text-xs text-gray-400 font-mono w-24">{mod.id}</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={editSuffix}
                  onChange={(e) => setEditSuffix(e.target.value)}
                  className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button onClick={() => handleUpdate(mod.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Save</button>
                <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400 font-mono w-24">{mod.id}</span>
                <span className="text-sm font-medium text-gray-900 flex-1">{mod.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{mod.suffix || "(none)"}</span>
                <button
                  onClick={() => { setEditingId(mod.id); setEditName(mod.name); setEditSuffix(mod.suffix); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mod.id, mod.name)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Colors Section ====================
function ColorsSection({
  brands,
  materials,
  modifiers,
  showMessage,
}: {
  brands: Brand[];
  materials: Material[];
  modifiers: Modifier[];
  showMessage: (type: "success" | "error", text: string) => void;
}) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedModifier, setSelectedModifier] = useState("");
  const [availableModifierIds, setAvailableModifierIds] = useState<string[]>([]);
  const [catalogEntries, setCatalogEntries] = useState<CatalogColorRow[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#");

  // Fetch available modifiers when brand+material changes
  useEffect(() => {
    if (!selectedBrand || !selectedMaterial) {
      setAvailableModifierIds([]);
      setSelectedModifier("");
      setCatalogEntries([]);
      return;
    }
    getCatalogModifiers(selectedBrand, selectedMaterial).then((ids) => {
      setAvailableModifierIds(ids);
    });
  }, [selectedBrand, selectedMaterial]);

  // Fetch colors when all three selected
  useEffect(() => {
    if (!selectedBrand || !selectedMaterial || !selectedModifier) {
      setCatalogEntries([]);
      return;
    }
    getCatalogColorsWithIds(selectedBrand, selectedMaterial, selectedModifier).then(setCatalogEntries);
  }, [selectedBrand, selectedMaterial, selectedModifier]);

  const handleAddColor = async () => {
    if (!newColorName.trim() || !newColorHex.trim() || !selectedBrand || !selectedMaterial || !selectedModifier) return;
    if (!/^#[0-9A-Fa-f]{6}$/.test(newColorHex.trim())) {
      showMessage("error", "Invalid hex color format");
      return;
    }
    const result = await addCatalogColor(
      selectedBrand, selectedMaterial, selectedModifier,
      newColorName.trim(), newColorHex.trim()
    );
    if (result.success) {
      // Refresh
      const updated = await getCatalogColorsWithIds(selectedBrand, selectedMaterial, selectedModifier);
      setCatalogEntries(updated);
      setNewColorName("");
      setNewColorHex("#");
      showMessage("success", `Color "${newColorName.trim()}" added`);
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDeleteColor = async (id: string, name: string) => {
    if (!confirm(`Delete color "${name}"?`)) return;
    const result = await deleteCatalogColor(id);
    if (result.success) {
      setCatalogEntries(catalogEntries.filter((c) => c.id !== id));
      showMessage("success", `Color "${name}" deleted`);
    } else {
      showMessage("error", result.error);
    }
  };

  // Show all modifiers if brand+material has catalog entries, else show all
  const filteredModifiers = availableModifierIds.length > 0
    ? modifiers.filter((m) => availableModifierIds.includes(m.id))
    : modifiers;

  const selectClass = "rounded-lg border border-gray-300 px-3 py-2 text-sm";

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Catalog</h2>
      <p className="text-sm text-gray-500 mb-4">
        Select a brand, material, and modifier to view and manage colors.
      </p>

      {/* Selectors */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={selectedBrand}
          onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModifier(""); }}
          className={selectClass}
        >
          <option value="">Select brand...</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={selectedMaterial}
          onChange={(e) => { setSelectedMaterial(e.target.value); setSelectedModifier(""); }}
          className={selectClass}
          disabled={!selectedBrand}
        >
          <option value="">Select material...</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select
          value={selectedModifier}
          onChange={(e) => setSelectedModifier(e.target.value)}
          className={selectClass}
          disabled={!selectedBrand || !selectedMaterial}
        >
          <option value="">Select modifier...</option>
          {(selectedBrand && selectedMaterial ? filteredModifiers : []).map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
          {/* Also allow selecting any modifier for adding new combos */}
          {availableModifierIds.length > 0 && (
            <option disabled>---</option>
          )}
          {availableModifierIds.length > 0 && modifiers
            .filter((m) => !availableModifierIds.includes(m.id))
            .map((m) => (
              <option key={m.id} value={m.id}>{m.name} (new)</option>
            ))
          }
        </select>
      </div>

      {/* Color list */}
      {selectedBrand && selectedMaterial && selectedModifier && (
        <>
          {/* Add color form */}
          <div className="flex gap-3 mb-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Color Name</label>
              <input
                type="text"
                placeholder="e.g., Jade White"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="w-36">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hex</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="#000000"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <button
              onClick={handleAddColor}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Add Color
            </button>
          </div>

          {/* Colors grid */}
          {catalogEntries.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              No colors for this combination yet. Add one above.
            </div>
          ) : (
            <div className="space-y-2">
              {catalogEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: entry.colorHex,
                      border: "1px solid #e5e7eb",
                      flexShrink: 0,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900 flex-1">{entry.colorName}</span>
                  <span className="text-xs text-gray-400 font-mono">{entry.colorHex}</span>
                  <button
                    onClick={() => handleDeleteColor(entry.id, entry.colorName)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-400 pt-2">{catalogEntries.length} colors</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
