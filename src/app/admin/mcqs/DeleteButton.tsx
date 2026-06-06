"use client";

import { useTransition } from "react";
import { IconTrash } from "@tabler/icons-react";
import { deleteMCQ } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm("Delete this MCQ?")) return;
        start(async () => {
          await deleteMCQ(id);
        });
      }}
      disabled={pending}
      className="admin-iconbtn admin-iconbtn--danger"
      aria-label="Delete"
    >
      <IconTrash size={14} />
    </button>
  );
}
