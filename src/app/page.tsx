import Link from "next/link";
import { getSpools } from "@/actions/spools";
import { SpoolList } from "@/components/SpoolList";

export default async function HomePage() {
  const result = await getSpools();

  if (!result.success) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          Error loading spools: {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Filament Manager</h1>
            <p className="text-sm text-gray-500 mt-1">
              {result.spools.length} spool{result.spools.length !== 1 ? "s" : ""} in inventory
            </p>
          </div>
          <Link
            href="/spools/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Add Spool
          </Link>
        </div>

        {/* Spool List */}
        <SpoolList spools={result.spools} />
      </div>
    </div>
  );
}
