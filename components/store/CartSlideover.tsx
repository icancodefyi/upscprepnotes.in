"use client";

import { useEffect } from "react";
import { IconX, IconMinus, IconPlus, IconTrash, IconShoppingBag } from "@tabler/icons-react";
import { useCart } from "@/lib/cart-context";
import PayButton from "@/components/ui/PayButton";
import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSlideover({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalItems, totalAmount } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100]" onClick={onClose}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <IconShoppingBag size={20} className="text-gray-700" />
            <span className="text-base font-bold text-gray-900">Cart ({totalItems})</span>
          </div>
          <button
            onClick={onClose}
            data-track="cart-close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <IconShoppingBag size={28} className="text-gray-300" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">Your cart is empty</p>
              <p className="mt-1 text-xs text-gray-400">Add products to get started</p>
              <Link
                href="/store"
                onClick={onClose}
                data-track="cart-browse-store"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.slug} className="flex gap-3 rounded-lg border border-gray-100 p-3">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg ${item.product.gradient}`}
                  >
                    <span className="text-lg font-black text-white">
                      {item.product.title.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/store/${item.product.slug}`}
                      onClick={onClose}
                      data-track={`cart-item-${item.product.slug}`}
                      className="line-clamp-1 text-sm font-bold text-gray-900 hover:text-emerald-700"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-gray-400">₹{item.product.price}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        data-track={`cart-qty-dec-${item.product.slug}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        {item.quantity === 1 ? <IconTrash size={12} /> : <IconMinus size={12} />}
                      </button>
                      <span className="min-w-[20px] text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        data-track={`cart-qty-inc-${item.product.slug}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        <IconPlus size={12} />
                      </button>
                      <span className="ml-auto text-sm font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4">
            {/* Cross-sell */}
            <CartCrossSell cartSlugs={items.map((i) => i.product.slug)} />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Instant digital delivery</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <PayButton
                amount={totalAmount}
                items={items.map((i) => ({ slug: i.product.slug, quantity: i.quantity, price: i.product.price }))}
                tracking="cart-checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500"
              >
                Proceed to Pay ₹{totalAmount.toLocaleString("en-IN")}
              </PayButton>
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              7-day refund &middot; Lifetime access &middot; Instant delivery
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CartCrossSell({ cartSlugs }: { cartSlugs: string[] }) {
  const { addItem } = useCart();
  const recommendations = PRODUCTS.filter(
    (p) => !p.comingSoon && !cartSlugs.includes(p.slug) && ["top-10-rankers-strategy", "answer-copies-compilation", "all-strategy-reports"].includes(p.slug)
  ).slice(0, 2);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Frequently bought together</p>
      <div className="mt-2 space-y-2">
        {recommendations.map((product) => (
          <div key={product.slug} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${product.gradient}`}>
              <span className="text-[10px] font-black text-white">{product.title.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-800">{product.title}</p>
              <p className="text-[10px] text-gray-500">₹{product.price}</p>
            </div>
            <button
              type="button"
              onClick={() => addItem(product)}
              data-track={`cart-crossell-${product.slug}`}
              className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
