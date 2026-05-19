"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: string; name?: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/toppers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="xs"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : "Confirm"}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => setConfirming(true)}
      className="text-red-500 hover:text-red-700"
    >
      Delete
    </Button>
  );
}
