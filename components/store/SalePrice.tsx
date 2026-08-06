"use client";

import type { StoreProduct } from "@/lib/store-products";
import { getEffectivePrice, isFlashSaleActive } from "@/lib/flash-sale";

export default function SalePrice({
  product,
  className = "",
}: {
  product: StoreProduct;
  className?: string;
}) {
  const active = isFlashSaleActive();
  const price = getEffectivePrice(product);
  return (
    <>
      <span className={`font-bold tabular-nums ${className || ""}`}>
        {active ? "₹99" : `₹${price}`}
      </span>
      {active && product.price > 99 && (
        <span className="text-xs text-muted-foreground line-through">₹{product.price}</span>
      )}
      {!active && product.originalPrice && (
        <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
      )}
    </>
  );
}
