import Link from "next/link";
import { getSpool, updateSpool } from "@/actions/spools";
import { SpoolForm } from "@/components/SpoolForm";
import type { CreateSpoolInput } from "@/lib/validations";

type EditSpoolPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSpoolPage({ params }: EditSpoolPageProps) {
  // Await params (Next.js 15+ dynamic route params are async)
  const { id } = await params;

  // Fetch spool data
  const result = await getSpool(id);

  // Handle not found
  if (!result.success) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          Spool not found
        </div>
        <Link
          href="/"
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const spool = result.spool;

  // Create server action with bound ID
  async function handleUpdate(data: CreateSpoolInput) {
    "use server";
    return updateSpool(id, data);
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Spool</h1>
      </div>

      {/* Form */}
      <SpoolForm
        initialData={{
          brand: spool.brand,
          material: spool.material,
          modifier: spool.modifier,
          colorName: spool.colorName,
          colorHex: spool.colorHex,
          initialWeight: spool.initialWeight,
          purchaseDate: spool.purchaseDate,
          price: spool.price,
          notes: spool.notes,
        }}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
}
