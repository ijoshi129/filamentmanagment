"use client";

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

const MATERIAL_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  pla: { bg: "bg-green-100", text: "text-green-800" },
  petg: { bg: "bg-blue-100", text: "text-blue-800" },
  abs: { bg: "bg-orange-100", text: "text-orange-800" },
  tpu: { bg: "bg-purple-100", text: "text-purple-800" },
  asa: { bg: "bg-amber-100", text: "text-amber-800" },
  nylon: { bg: "bg-pink-100", text: "text-pink-800" },
};

type SpoolCardProps = {
  spool: Spool;
};

export function SpoolCard({ spool }: SpoolCardProps) {
  const statusStyle = STATUS_COLORS[spool.status] || STATUS_COLORS.in_use;
  const materialColors = MATERIAL_BADGE_COLORS[spool.material] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Color swatch header - increased to 100px */}
      <div
        style={{
          height: "100px",
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
          {/* Prominent colored material badge */}
          <span
            className={`inline-flex items-center rounded-full ${materialColors.bg} ${materialColors.text} px-3 py-1 text-xs font-bold`}
          >
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
}
