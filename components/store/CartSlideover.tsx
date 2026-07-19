"use client";

import { useEffect, useState, useRef } from "react";
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
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      try { setEmail(localStorage.getItem("upsc-email") || ""); } catch {}
      setIsMobile(window.innerWidth < 768);
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => dialogRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={onClose}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`fixed right-0 top-0 z-[101] flex h-full w-full flex-col bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${isMobile ? "" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2">
            <IconShoppingBag size={18} className="text-muted-foreground sm:size-5" />
            <span className="text-sm font-bold sm:text-base">Cart ({totalItems})</span>
          </div>
          <button
            onClick={onClose}
            data-track="cart-close"
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          {items.length === 0 ? (
            <div className="mt-10 text-center sm:mt-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary sm:h-16 sm:w-16">
                <IconShoppingBag size={24} className="text-muted-foreground sm:size-7" />
              </div>
              <p className="mt-3 text-sm font-semibold sm:mt-4">Your cart is empty</p>
              <p className="mt-1 text-xs text-muted-foreground">Add products to get started</p>
              <Link
                href="/store"
                onClick={onClose}
                data-track="cart-browse-store"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div key={item.product.slug} className="flex gap-2 rounded-xl border border-border p-2 sm:gap-3 sm:p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary sm:h-16 sm:w-16">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${item.product.gradient}`}>
                        <span className="text-base font-black text-white sm:text-lg">{item.product.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/store/${item.product.slug}`}
                      onClick={onClose}
                      data-track={`cart-item-${item.product.slug}`}
                      className="line-clamp-1 text-xs font-bold hover:text-brand sm:text-sm"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-[11px] text-muted-foreground sm:text-xs">₹{item.product.price}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2 sm:gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        data-track={`cart-qty-dec-${item.product.slug}`}
                        aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
                      >
                        {item.quantity === 1 ? <IconTrash size={12} /> : <IconMinus size={12} />}
                      </button>
                      <span className="min-w-[20px] text-center text-xs font-semibold sm:min-w-[24px] sm:text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        data-track={`cart-qty-inc-${item.product.slug}`}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
                      >
                        <IconPlus size={12} />
                      </button>
                      <span className="ml-auto text-xs font-bold sm:text-sm">
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
          <div className="border-t border-border px-4 py-3 sm:px-5 sm:py-4">
            <CartCrossSell cartSlugs={items.map((i) => i.product.slug)} />

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground sm:text-xs">
                <span>Instant digital delivery</span>
                <span className="text-brand">Free</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-sm font-bold sm:text-base">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <PayButton
                amount={totalAmount}
                email={email}
                items={items.map((i) => ({ slug: i.product.slug, quantity: i.quantity, price: i.product.price }))}
                tracking="cart-checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-brand-foreground shadow-lg transition hover:bg-brand/90 sm:py-3.5"
              >
                Proceed to Pay ₹{totalAmount.toLocaleString("en-IN")}
              </PayButton>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              7-day refund · Lifetime access · Instant delivery
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
    (p) => !p.comingSoon && !cartSlugs.includes(p.slug) && ["top-10-rankers-strategy", "answer-copies-compilation"].includes(p.slug)
  ).slice(0, 2);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-4 rounded-xl border border-border bg-secondary p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Frequently bought together</p>
      <div className="mt-2 space-y-2">
        {recommendations.map((product) => (
          <div key={product.slug} className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-card">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${product.gradient}`}>
                  <span className="text-[10px] font-black text-white">{product.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{product.title}</p>
              <p className="text-[10px] text-muted-foreground">₹{product.price}</p>
            </div>
            <button
              type="button"
              onClick={() => addItem(product)}
              data-track={`cart-crossell-${product.slug}`}
              className="rounded-lg bg-card px-2.5 py-1.5 text-[10px] font-semibold shadow-sm transition hover:bg-background"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
