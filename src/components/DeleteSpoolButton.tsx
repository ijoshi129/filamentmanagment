"use client";

import { useState } from "react";
import { deleteSpool } from "@/actions/spools";

type DeleteSpoolButtonProps = {
  spoolId: string;
  spoolName: string;
};

export function DeleteSpoolButton({
  spoolId,
  spoolName,
}: DeleteSpoolButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Confirmation dialog
    const confirmed = confirm(
      `Delete ${spoolName}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    // Delete spool
    setIsDeleting(true);
    try {
      const result = await deleteSpool(spoolId);

      if (!result.success) {
        alert(`Error deleting spool: ${result.error}`);
      }
      // On success, page will auto-refresh due to revalidatePath
    } catch (err) {
      alert(
        `Error deleting spool: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm text-red-600 hover:text-red-800 underline disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
