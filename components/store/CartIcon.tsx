"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import { useCart } from "@/lib/cart-context";

export default function CartIcon({ onClick }: { onClick: () => void }) {
  const { totalItems } = useCart();
  return (
    <button
      onClick={onClick}
      aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
      className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] transition hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)]"
    >
      <IconShoppingBag size={18} />
      {totalItems > 0 && (
        <span className="tab absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-s font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
