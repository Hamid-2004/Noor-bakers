"use client";

import { PremiumImage } from "@/components/premium-image";
import { categories } from "@/data/categories";
import { easePremium, fadeInUp } from "@/lib/motion";
import { useUiStore } from "@/store/use-ui-store";
import { motion } from "framer-motion";

export function CategoriesSection() {
  const { setSelectedCategory } = useUiStore();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="categories" className="bg-[#f5f5f5] px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: easePremium }}
          className="mb-8 text-2xl font-semibold tracking-tight text-[#0b2c5d] sm:mb-10 sm:text-3xl"
        >
          Categories
        </motion.h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.article
              key={category.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05, duration: 0.45, ease: easePremium }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl bg-white premium-shadow transition-all duration-300 hover:premium-shadow-lg hover:ring-2 hover:ring-[#0b2c5d]/20 relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                <PremiumImage
                  src={category.image}
                  alt={category.name}
                  fill
                  hoverZoom
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c5d]/60 via-[#0b2c5d]/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10">
                <p className="text-sm font-semibold text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 sm:text-lg">
                  {category.name}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
