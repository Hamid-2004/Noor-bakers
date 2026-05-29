"use client";

import { PremiumImage } from "@/components/premium-image";
import { assets } from "@/lib/assets";
import { WHATSAPP_ORDER_LINK } from "@/lib/constants";
import { easePremium, fadeInRight, fadeInUp, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";

const heroCards = [
  { title: "Artisan Cakes", image: assets.products.cakes },
  { title: "Premium Nimco", image: assets.products.nimcoPackaging },
  { title: "Fresh Bread", image: assets.categories.breads },
  { title: "Traditional Sweets", image: assets.products.sweetBox },
];

export function HeroSection() {
  return (
    <section className="watermark-bg relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <PremiumImage
        src={assets.backgrounds.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        containerClassName="absolute inset-0 -z-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b2c5d]/45 via-[#0b2c5d]/18 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/55 via-white/25 to-white/10" />

      <motion.div
        className="relative z-10 mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-8 xl:gap-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} transition={{ duration: 0.65, ease: easePremium }}>
          <div className="max-w-xl rounded-3xl bg-white/72 p-1 backdrop-blur-sm sm:p-0 sm:bg-transparent sm:backdrop-blur-none">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0b2c5d]/75">Noor Bakers</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-[#0b2c5d] sm:text-5xl lg:text-[3.25rem]">
              Tradition of Quality & Taste
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#0b2c5d]/85 sm:text-lg">
              Fresh sweets, nimco, cakes & bakery items made with love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.a
                href="#categories"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-full bg-[#0b2c5d] px-6 py-3 text-sm font-medium text-white shadow-md shadow-[#0b2c5d]/20 transition-colors hover:bg-[#082249]"
              >
                Explore Menu
              </motion.a>
              <motion.a
                href={WHATSAPP_ORDER_LINK}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-full border border-[#0b2c5d]/20 bg-white/90 px-6 py-3 text-sm font-medium text-[#0b2c5d] shadow-sm transition-colors hover:border-[#0b2c5d]/35 hover:bg-white"
              >
                Order on WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInRight} transition={{ duration: 0.7, ease: easePremium }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl premium-shadow-lg ring-1 ring-[#0b2c5d]/10">
            <PremiumImage
              src={assets.hero.interior}
              alt="Noor Bakers interior"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c5d]/35 via-[#0b2c5d]/5 to-transparent" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            {heroCards.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.5, ease: easePremium }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-white/90 bg-white premium-shadow transition-shadow duration-300 hover:premium-shadow-lg"
              >
                <PremiumImage
                  src={item.image}
                  alt={item.title}
                  width={320}
                  height={200}
                  hoverZoom
                  className="aspect-[4/3] w-full object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-xs tracking-wide text-[#0b2c5d]/60">Featured</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#0b2c5d] sm:text-base">{item.title}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
