"use client";

import { PremiumImage } from "@/components/premium-image";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { useCartStore } from "@/store/use-cart-store";
import { Product } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Props {
  product: Product;
}

export function ProductDetailsClient({ product }: Props) {
  const { addToCart, open: openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  
  const galleryImages = useMemo(() => {
    return product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];
  }, [product]);

  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  // Handle product change (reset gallery state if we navigate between products)
  useEffect(() => {
    setActiveImage(galleryImages[0]);
    setQuantity(1);
  }, [product.id, galleryImages]);

  const categoryName = useMemo(() => {
    const cat = categories.find((c) => c.id === product.category);
    return cat ? cat.name : product.category;
  }, [product]);

  const relatedProducts = useMemo(() => {
    const sameCategory = products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    if (sameCategory.length > 0) return sameCategory.slice(0, 3);
    return products.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product]);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    openCart();
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Back Button & Breadcrumbs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b2c5d] hover:opacity-85"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
        <nav className="flex text-xs text-[#0b2c5d]/60 sm:text-sm font-medium">
          <Link href="/" className="hover:text-[#0b2c5d]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c5d]/40 capitalize">{categoryName}</span>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c5d] font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column: Product Gallery */}
        <div className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#0b2c5d]/10 bg-[#f5f5f5]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <PremiumImage
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            {isOutOfStock && (
              <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImage === img
                      ? "border-[#0b2c5d] scale-105 shadow-sm"
                      : "border-[#d9d9d9]/60 hover:border-[#0b2c5d]/30"
                  }`}
                >
                  <PremiumImage
                    src={img}
                    alt={`${product.name} Gallery ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <span className="inline-block rounded-full bg-[#0b2c5d]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0b2c5d]">
              {categoryName}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b2c5d] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-bold text-[#0b2c5d]">
              PKR {product.price}
            </p>
            <div className="mt-6 border-t border-[#0b2c5d]/10 pt-6">
              <h3 className="text-sm font-semibold text-[#0b2c5d] uppercase tracking-wider">
                Description
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#0b2c5d]/70 sm:text-base">
                {product.description}
              </p>
            </div>
            
            {/* Stock Info */}
            <div className="mt-6 flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? "bg-red-500" : product.stock < 5 ? "bg-amber-500" : "bg-green-500"}`} />
              <p className="text-sm font-medium text-[#0b2c5d]/80">
                {isOutOfStock
                  ? "Sold out"
                  : product.stock < 5
                  ? `Only ${product.stock} items left in stock`
                  : "In stock - ready for delivery"}
              </p>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-8 border-t border-[#0b2c5d]/10 pt-8 space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0b2c5d]">Quantity:</span>
                <div className="flex items-center gap-1 bg-[#f5f5f5] rounded-2xl p-1.5 border border-[#0b2c5d]/5">
                  <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-[#0b2c5d] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-base font-bold text-[#0b2c5d]">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-[#0b2c5d] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0b2c5d] py-4 text-center text-sm font-bold text-white shadow-lg shadow-[#0b2c5d]/10 transition-all hover:bg-[#082249] hover:shadow-xl disabled:bg-[#d9d9d9] disabled:text-[#0b2c5d]/40 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
              >
                <ShoppingBag className="h-4 w-4" />
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 border-t border-[#0b2c5d]/10 pt-16">
        <h2 className="text-2xl font-bold tracking-tight text-[#0b2c5d] mb-8">
          Related Products
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-3xl border border-[#d9d9d9]/60 bg-white premium-shadow transition-all duration-300 hover:border-[#0b2c5d]/20 hover:premium-shadow-lg"
            >
              <Link href={`/products/${p.slug}`} className="block relative aspect-[5/4] overflow-hidden bg-[#f5f5f5]">
                <PremiumImage
                  src={p.image}
                  alt={p.name}
                  fill
                  hoverZoom
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </Link>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/products/${p.slug}`} className="hover:opacity-85">
                    <p className="font-semibold text-[#0b2c5d]">{p.name}</p>
                  </Link>
                  <p className="shrink-0 text-sm font-bold text-[#0b2c5d]/85">PKR {p.price}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#0b2c5d]/60 capitalize">{p.category}</span>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-xs font-semibold text-[#0b2c5d] hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
