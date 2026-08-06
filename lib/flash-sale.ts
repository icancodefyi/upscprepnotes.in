import type { StoreProduct } from "./store-products";

export interface FlashSale {
  active: boolean;
  endDate: string; // ISO
  price: number;
  label: string;
}

// 48-hour launch sale: all products at ₹99
export const FLASH_SALE: FlashSale = {
  active: true,
  endDate: "2026-08-07T23:59:59+05:30",
  price: 99,
  label: "Launch Sale",
};

export function isFlashSaleActive(): boolean {
  if (!FLASH_SALE.active) return false;
  return new Date() < new Date(FLASH_SALE.endDate);
}

export function getFlashSalePrice(): number | null {
  return isFlashSaleActive() ? FLASH_SALE.price : null;
}

export function getEffectivePrice(product: StoreProduct): number {
  return getFlashSalePrice() ?? product.price;
}

export function getEffectiveOriginalPrice(product: StoreProduct): number | null {
  if (!isFlashSaleActive()) return product.originalPrice;
  // During flash sale, show the normal price struck through
  return Math.max(product.originalPrice ?? 0, product.price) || null;
}
