"use client";

import { PremiumImage } from "@/components/premium-image";
import { useCartStore } from "@/store/use-cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function CartDrawer() {
  const { isOpen, close, items, updateQuantity, removeItem } = useCartStore();
  const isHydrated = useHydrated();
  const router = useRouter();

  const total = useMemo(() => {
    if (!isHydrated) return 0;
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items, isHydrated]);

  const totalItems = useMemo(() => {
    if (!isHydrated) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items, isHydrated]);

  const handleCheckout = () => {
    close();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-[#0b2c5d]/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#0b2c5d]/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#0b2c5d]" />
                <h3 className="text-lg font-bold text-[#0b2c5d] tracking-tight">Your Cart</h3>
                {isHydrated && totalItems > 0 && (
                  <span className="rounded-full bg-[#0b2c5d]/10 px-2 py-0.5 text-xs font-semibold text-[#0b2c5d]">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={close}
                className="rounded-full p-2 text-[#0b2c5d] transition-all hover:bg-[#0b2c5d]/5 hover:scale-105"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {!isHydrated || items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="rounded-full bg-[#f5f5f5] p-6 mb-4">
                    <ShoppingCart className="h-10 w-10 text-[#0b2c5d]/30" />
                  </div>
                  <p className="font-medium text-[#0b2c5d]">Your cart is empty</p>
                  <p className="text-sm text-[#0b2c5d]/60 mt-1 max-w-[240px]">
                    Add some delicious fresh bakery items to get started!
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 rounded-xl border border-[#0b2c5d] px-5 py-2.5 text-sm font-semibold text-[#0b2c5d] transition-all hover:bg-[#0b2c5d] hover:text-white"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <motion.div layout className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="group relative overflow-hidden rounded-2xl border border-[#0b2c5d]/10 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#0b2c5d]/20"
                      >
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5] border border-[#0b2c5d]/5">
                            <PremiumImage
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="truncate font-semibold text-[#0b2c5d] text-sm sm:text-base leading-tight">
                                  {item.name}
                                </h4>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-[#0b2c5d]/40 transition-colors hover:text-red-500 p-1"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-[#0b2c5d]/60 mt-0.5 capitalize">{item.category}</p>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <p className="font-bold text-[#0b2c5d] text-sm">
                                PKR {item.price * item.quantity}
                              </p>
                              
                              <div className="flex items-center gap-1 bg-[#f5f5f5] rounded-xl p-1 border border-[#0b2c5d]/5">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0b2c5d] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-7 text-center text-sm font-semibold text-[#0b2c5d]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= (item.stock ?? 99)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0b2c5d] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Summary & Checkout */}
            {isHydrated && items.length > 0 && (
              <div className="border-t border-[#0b2c5d]/10 bg-white/95 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[#0b2c5d]/70">
                    <span>Subtotal</span>
                    <span>PKR {total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#0b2c5d]/70">
                    <span>Delivery Fee</span>
                    <span className="italic text-xs">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-[#0b2c5d]/5 pt-2 flex justify-between text-[#0b2c5d] font-bold text-lg">
                    <span>Total</span>
                    <span>PKR {total}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-2xl bg-[#0b2c5d] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0b2c5d]/10 transition-all hover:bg-[#082249] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
