"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Spool } from "@/db/schema";
import { formatMaterial } from "@/lib/materials";
import { DeleteSpoolButton } from "@/components/DeleteSpoolButton";

const STATUS_LABELS: Record<string, string> = {
  sealed: "Sealed",
  in_use: "Open",
  empty: "Empty",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  sealed: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  in_use: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
  empty: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

type Filters = {
  status: string;
  brand: string;
  material: string;
  modifier: string;
};

type SpoolListProps = {
  spools: Spool[];
};

export function SpoolList({ spools }: SpoolListProps) {
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    brand: "all",
    material: "all",
    modifier: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for each filter
  const uniqueBrands = useMemo(
    () => [...new Set(spools.map((s) => s.brand))].sort(),
    [spools]
  );
  const uniqueMaterials = useMemo(
    () => [...new Set(spools.map((s) => s.material))].sort(),
    [spools]
  );
  const uniqueModifiers = useMemo(
    () => [...new Set(spools.map((s) => s.modifier).filter(Boolean) as string[])].sort(),
    [spools]
  );

  const filtered = useMemo(() => {
    return spools.filter((s) => {
      if (filters.status !== "all" && s.status !== filters.status) return false;
      if (filters.brand !== "all" && s.brand !== filters.brand) return false;
      if (filters.material !== "all" && s.material !== filters.material) return false;
      if (filters.modifier !== "all" && (s.modifier || "") !== filters.modifier) return false;
      return true;
    });
  }, [spools, filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "all").length;

  const clearFilters = () =>
    setFilters({ status: "all", brand: "all", material: "all", modifier: "all" });

  const updateFilter = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  if (spools.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            backgroundColor: "#f3f4f6",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
          }}
        >
          🧵
        </div>
        <p className="text-lg font-medium text-gray-700 mb-2">No spools yet</p>
        <p className="text-gray-500 mb-6">Add your first filament spool to get started</p>
        <Link
          href="/spools/new"
          className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add Spool
        </Link>
      </div>
    );
  }

  const selectStyle: React.CSSProperties = {
    padding: "7px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    minWidth: "130px",
    cursor: "pointer",
  };

  return (
    <div>
      {/* Filter toggle */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 500,
            backgroundColor: showFilters ? "#1e40af" : "#f3f4f6",
            color: showFilters ? "#ffffff" : "#374151",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                fontSize: "11px",
                fontWeight: 700,
                backgroundColor: showFilters ? "rgba(255,255,255,0.25)" : "#3b82f6",
                color: "#ffffff",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            style={{
              fontSize: "13px",
              color: "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Clear all
          </button>
        )}

        <span className="text-sm text-gray-400 ml-auto">
          {filtered.length} of {spools.length} spool{spools.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#fafafa",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              style={selectStyle}
            >
              <option value="all">All</option>
              <option value="sealed">Sealed</option>
              <option value="in_use">Open</option>
              <option value="empty">Empty</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => updateFilter("brand", e.target.value)}
              style={selectStyle}
            >
              <option value="all">All</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Material
            </label>
            <select
              value={filters.material}
              onChange={(e) => updateFilter("material", e.target.value)}
              style={selectStyle}
            >
              <option value="all">All</option>
              {uniqueMaterials.map((m) => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Type
            </label>
            <select
              value={filters.modifier}
              onChange={(e) => updateFilter("modifier", e.target.value)}
              style={selectStyle}
            >
              <option value="all">All</option>
              {uniqueModifiers.map((m) => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace(/-/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No spools match your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((spool) => {
            const statusStyle = STATUS_COLORS[spool.status] || STATUS_COLORS.in_use;
            return (
              <div
                key={spool.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Color swatch header */}
                <div
                  style={{
                    height: "80px",
                    backgroundColor: spool.colorHex,
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                />

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {spool.colorName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {spool.brand}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                      {formatMaterial(spool.material, spool.modifier)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "2px 10px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: statusStyle.dot,
                        }}
                      />
                      {STATUS_LABELS[spool.status] || spool.status}
                    </span>
                    <span>{spool.initialWeight}g</span>
                    {spool.purchaseDate && <span>{spool.purchaseDate}</span>}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Link
                      href={`/spools/${spool.id}/edit`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteSpoolButton
                      spoolId={spool.id}
                      spoolName={`${spool.brand} ${spool.colorName}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
