import Link from "next/link";
import { getSpools } from "@/actions/spools";
import { SpoolList } from "@/components/SpoolList";

export default async function HomePage() {
  // Fetch spools server-side
  const result = await getSpools();

  // Handle error
  if (!result.success) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          Error loading spools: {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Filament Manager</h1>
        <p className="mt-2 text-gray-600">
          Track your 3D printing filament inventory
        </p>
      </div>

      {/* Add Spool Button */}
      <div className="mb-6">
        <Link
          href="/spools/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Add Spool
        </Link>
      </div>

      {/* Spool List */}
      <SpoolList spools={result.spools} />
    </div>
  );
}
