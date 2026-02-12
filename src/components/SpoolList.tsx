"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Spool } from "@/db/schema";
import { SpoolCard } from "@/components/SpoolCard";

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
          {filtered.map((spool) => (
            <SpoolCard key={spool.id} spool={spool} />
          ))}
        </div>
      )}
    </div>
  );
}
