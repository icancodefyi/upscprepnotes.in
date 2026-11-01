"use client";

import { useEffect, useState, useRef } from "react";
import { IconX, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useCart } from "@/lib/cart-context";
import PayButton from "@/components/ui/PayButton";
import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";
import { getEffectivePrice, isFlashSaleActive } from "@/lib/flash-sale";

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
          <div className="absolute inset-0 bg-[rgba(11,12,16,0.4)]" />
        </div>
      )}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`up fixed right-0 top-0 z-[101] flex h-full w-full flex-col bg-white transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "visible translate-x-0 shadow-[-24px_0_48px_-24px_rgba(11,12,16,0.35)]" : "invisible translate-x-full"
        } ${isMobile ? "" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="t-head text-l">Cart ({totalItems})</span>
          </div>
          <button
            onClick={onClose}
            data-track="cart-close"
            aria-label="Close cart"
            className="grid h-11 w-11 place-items-center rounded-full text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-m font-bold">Your cart is empty</p>
              <p className="mt-1 text-s text-[var(--muted)]">Add products to get started</p>
              <Link
                href="/store"
                onClick={onClose}
                data-track="cart-browse-store"
                className="btn btn-ink mt-5 h-11 px-5 [--btn-fs:14px]"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div key={item.product.slug} className="flex gap-3 rounded-[18px] bg-white p-3 shadow-[0_0_0_1px_var(--line-2)]">
                  <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[var(--canvas)]">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${item.product.gradient}`}>
                        <span className="text-m font-bold text-white">{item.product.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/store/${item.product.slug}`}
                      onClick={onClose}
                      data-track={`cart-item-${item.product.slug}`}
                      className="line-clamp-2 text-s font-bold hover:text-[var(--accent)]"
                    >
                      {item.product.title}
                    </Link>
                    <p className="tab text-s text-[var(--muted)]">
                      {isFlashSaleActive() ? (
                        <>
                          <span className="text-emerald-700">₹{getEffectivePrice(item.product)}</span>{" "}
                          <s className="text-muted-foreground">₹{item.product.price}</s>
                        </>
                      ) : (
                        <>₹{item.product.price}</>
                      )}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        data-track={`cart-qty-dec-${item.product.slug}`}
                        aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                        className="grid h-8 w-8 place-items-center rounded-full text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-[var(--canvas)]"
                      >
                        {item.quantity === 1 ? <IconTrash size={12} /> : <IconMinus size={12} />}
                      </button>
                      <span className="tab min-w-6 text-center text-s font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        data-track={`cart-qty-inc-${item.product.slug}`}
                        aria-label="Increase quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-[var(--canvas)]"
                      >
                        <IconPlus size={12} />
                      </button>
                      <span className="tab ml-auto text-s font-bold">
                        ₹{(getEffectivePrice(item.product) * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--line)] px-5 py-4">
            <CartCrossSell cartSlugs={items.map((i) => i.product.slug)} />

            <div className="space-y-1.5 text-s">
              <div className="tab flex justify-between text-[var(--ink-2)]">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Instant digital delivery</span>
                <span className="font-bold text-[#14532d]">Free</span>
              </div>
              <div className="border-t border-[var(--line)] pt-2">
                <div className="tab flex justify-between text-m font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <PayButton
                amount={totalAmount}
                email={email}
                items={items.map((i) => ({ slug: i.product.slug, quantity: i.quantity, price: getEffectivePrice(i.product) }))}
                tracking="cart-checkout"
                className="btn btn-blue w-full justify-center"
              >
                Proceed to Pay ₹{totalAmount.toLocaleString("en-IN")}
              </PayButton>
            </div>
            <p className="mt-2 text-center text-s text-[var(--muted)]">
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
    (p) => !p.comingSoon && !cartSlugs.includes(p.slug) && ["top-10-rankers-strategy", "answer-copies-compilation", "all-strategy-reports"].includes(p.slug)
  ).slice(0, 2);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-4 rounded-[16px] bg-[var(--canvas)] p-3">
      <p className="text-s font-bold">Frequently bought together</p>
      <div className="mt-2 space-y-2">
        {recommendations.map((product) => (
          <div key={product.slug} className="flex items-center gap-2">
            <div className="grid h-10 w-8 shrink-0 place-items-center overflow-hidden rounded-[6px] bg-white">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${product.gradient}`}>
                  <span className="text-s font-bold text-white">{product.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-s font-bold">{product.title}</p>
              <p className="tab text-s text-[var(--muted)]">
                {isFlashSaleActive() ? (
                  <>
                    <span className="font-semibold text-emerald-700">₹{getEffectivePrice(product)}</span>{" "}
                    <s>₹{product.price}</s>
                  </>
                ) : (
                  <>₹{product.price}</>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => addItem(product)}
              data-track={`cart-crossell-${product.slug}`}
              className="btn btn-paper h-8 px-3 [--btn-fs:14px]"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
