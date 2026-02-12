"use client";

import Link from "next/link";
import type { Spool } from "@/db/schema";
import { formatMaterial } from "@/lib/materials";
import { DeleteSpoolButton } from "@/components/DeleteSpoolButton";

type SpoolListProps = {
  spools: Spool[];
};

export function SpoolList({ spools }: SpoolListProps) {
  // Empty state
  if (spools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No spools in your inventory yet</p>
        <Link
          href="/spools/new"
          className="inline-block text-blue-600 hover:text-blue-800 underline"
        >
          Add your first spool
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {spools.map((spool) => (
          <div
            key={spool.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Color swatch */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="h-6 w-6 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: spool.colorHex }}
                  title={spool.colorName}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {spool.colorName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {spool.brand} • {formatMaterial(spool.material, spool.modifier)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{spool.initialWeight}g</span>
                </div>
                <div className="text-sm text-gray-600">
                  {spool.purchaseDate || "N/A"}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/spools/${spool.id}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
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
          </div>
        ))}
      </div>
    </div>
  );
}
