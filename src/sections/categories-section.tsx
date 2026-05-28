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
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.article
              key={category.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05, duration: 0.45, ease: easePremium }}
              whileHover={{ y: -10 }}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer overflow-hidden rounded-3xl bg-white premium-shadow transition-all duration-300 hover:premium-shadow-lg hover:ring-1 hover:ring-[#0b2c5d]/12"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c5d]/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-sm font-medium text-[#0b2c5d] transition-colors duration-200 group-hover:text-[#082249] sm:text-base">
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
