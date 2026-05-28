"use client";

import { PremiumImage } from "@/components/premium-image";
import { assets } from "@/lib/assets";
import { WHATSAPP_ORDER_LINK } from "@/lib/constants";
import { easePremium } from "@/lib/motion";
import { useCartStore } from "@/store/use-cart-store";
import { useLocationStore } from "@/store/use-location-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { city, area } = useLocationStore();
  const { open, items } = useCartStore();
  const isHydrated = useHydrated();
  
  const itemCount = useMemo(() => {
    if (!isHydrated) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items, isHydrated]);

  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-white/40 shadow-sm shadow-[#0b2c5d]/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <PremiumImage
            src={assets.logo.navbar}
            alt="Noor Bakers"
            width={140}
            height={48}
            className="h-10 w-auto max-w-[120px] object-contain sm:h-11 sm:max-w-[140px]"
            priority
          />
          <p className="hidden rounded-full bg-white/80 px-3 py-1 text-xs text-[#0b2c5d] shadow-sm lg:block">
            {city}, {area}
          </p>
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          {["Home", "Categories", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : item === "Categories" ? "/#categories" : "#"}
              className="text-sm text-[#0b2c5d]/80 transition-colors duration-200 hover:text-[#0b2c5d]"
            >
              {item}
            </Link>
          ))}
          <motion.button
            onClick={open}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-full bg-white/90 p-2.5 text-[#0b2c5d] shadow-sm transition-colors hover:bg-[#f5f5f5]"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0b2c5d] text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </motion.button>
          <button className="rounded-full border border-[#d9d9d9]/80 bg-white/80 px-4 py-2 text-sm text-[#0b2c5d] transition-all duration-200 hover:border-[#0b2c5d]/25 hover:bg-white">
            Login
          </button>
          <motion.a
            href={WHATSAPP_ORDER_LINK}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-[#0b2c5d] px-4 py-2 text-sm text-white shadow-sm shadow-[#0b2c5d]/15 transition-colors hover:bg-[#082249]"
          >
            Order on WhatsApp
          </motion.a>
        </div>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#0b2c5d] transition-colors hover:bg-white/60 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: easePremium }}
            className="overflow-hidden border-t border-[#d9d9d9]/60 bg-white/95 backdrop-blur-md md:hidden"
          >
            <div className="px-4 py-4">
              <p className="mb-3 text-sm text-[#0b2c5d]/80">
                {city}, {area}
              </p>
              <div className="flex flex-col gap-3">
                {["Home", "Categories", "About", "Contact"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={item === "Home" ? "/" : item === "Categories" ? "/#categories" : "#"}
                      className="block text-sm text-[#0b2c5d] transition-colors hover:text-[#082249]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                <button
                  onClick={() => {
                    open();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-xl border border-[#d9d9d9] bg-white p-2.5 text-sm text-[#0b2c5d] transition-colors hover:bg-[#f5f5f5]"
                >
                  Cart ({itemCount})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
