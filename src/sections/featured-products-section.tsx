"use client";

import { PremiumImage } from "@/components/premium-image";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { easePremium } from "@/lib/motion";
import { useCartStore } from "@/store/use-cart-store";
import { useUiStore } from "@/store/use-ui-store";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

export function FeaturedProductsSection() {
  const { addToCart, open } = useCartStore();
  const { selectedCategory, setSelectedCategory } = useUiStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="products" className="px-4 py-14 sm:px-6 sm:py-16 scroll-mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: easePremium }}
            className="text-2xl font-semibold tracking-tight text-[#0b2c5d] sm:text-3xl"
          >
            Explore Our Products
          </motion.h2>

          {/* Categories Filtering Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1, ease: easePremium }}
            className="flex max-w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0"
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                selectedCategory === "all" ? "text-white" : "text-[#0b2c5d]/70 hover:text-[#0b2c5d]"
              }`}
            >
              {selectedCategory === "all" && (
                <motion.span
                  layoutId="activeFilterPill"
                  className="absolute inset-0 z-0 rounded-full bg-[#0b2c5d]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">All</span>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                  selectedCategory === category.id ? "text-white" : "text-[#0b2c5d]/70 hover:text-[#0b2c5d]"
                }`}
              >
                {selectedCategory === category.id && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="absolute inset-0 z-0 rounded-full bg-[#0b2c5d]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="rounded-full bg-[#f5f5f5] p-6 mb-4">
                  <svg className="h-10 w-10 text-[#0b2c5d]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0b2c5d]">No products found</h3>
                <p className="mt-2 text-[#0b2c5d]/60 max-w-md mx-auto">
                  We couldn&apos;t find any products in this category at the moment. Please check back later or explore other categories.
                </p>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="mt-6 rounded-full bg-[#0b2c5d] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0b2c5d]/20 transition-colors hover:bg-[#082249]"
                >
                  View All Products
                </button>
              </motion.div>
            ) : (
              filteredProducts.map((product) => {
                const quantity = quantities[product.id] ?? 1;
                return (
                  <motion.article
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: easePremium }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-[#d9d9d9]/50 bg-white premium-shadow transition-all duration-300 hover:border-[#0b2c5d]/30 hover:premium-shadow-lg hover:ring-2 hover:ring-[#0b2c5d]/10"
                  >
                    <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                      <PremiumImage
                        src={product.image}
                        alt={product.name}
                        fill
                        hoverZoom
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c5d]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </Link>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/products/${product.slug}`} className="hover:opacity-80 transition-opacity">
                          <p className="font-bold text-[#0b2c5d] group-hover:text-[#082249] transition-colors">{product.name}</p>
                        </Link>
                        <p className="shrink-0 text-sm font-extrabold text-[#0b2c5d]">PKR {product.price}</p>
                      </div>
                      <p className="text-xs text-[#0b2c5d]/60 mt-1.5 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>
                      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 rounded-xl bg-[#f5f5f5] p-1 border border-[#0b2c5d]/5">
                          <button
                            onClick={() =>
                              setQuantities((prev) => ({ ...prev, [product.id]: Math.max(1, quantity - 1) }))
                            }
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0b2c5d] hover:bg-white transition-all shadow-sm active:scale-95"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-[#0b2c5d]">{quantity}</span>
                          <button
                            onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: Math.min(product.stock, quantity + 1) }))}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0b2c5d] hover:bg-white transition-all shadow-sm active:scale-95"
                          >
                            +
                          </button>
                        </div>
                        <motion.button
                          onClick={() => {
                            addToCart(product, quantity);
                            open();
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-xl bg-[#0b2c5d] px-4 py-2 text-sm font-bold tracking-wide text-white shadow-md shadow-[#0b2c5d]/20 transition-colors duration-200 hover:bg-[#082249]"
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
