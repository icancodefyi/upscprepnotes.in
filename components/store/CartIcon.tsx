"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import { useCart } from "@/lib/cart-context";

export default function CartIcon({ onClick }: { onClick: () => void }) {
  const { totalItems } = useCart();
  return (
    <button
      onClick={onClick}
      aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-brand hover:text-brand"
    >
      <IconShoppingBag size={18} />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
