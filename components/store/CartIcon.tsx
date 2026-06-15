"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import { useCart } from "@/lib/cart-context";

export default function CartIcon({ onClick }: { onClick: () => void }) {
  const { totalItems } = useCart();
  return (
    <button
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-emerald-200 hover:text-emerald-700"
    >
      <IconShoppingBag size={18} />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
