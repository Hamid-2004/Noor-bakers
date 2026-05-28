"use client";

import { PremiumImage } from "@/components/premium-image";
import { assets } from "@/lib/assets";
import { WHATSAPP_ORDER_LINK } from "@/lib/constants";
import { easePremium, fadeInUp, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-watermark relative overflow-hidden bg-[#0b2c5d] px-4 py-12 text-white sm:px-6 sm:py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative z-10 mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-10"
      >
        <motion.div variants={fadeInUp} transition={{ duration: 0.45, ease: easePremium }}>
          <PremiumImage
            src={assets.logo.white}
            alt="Noor Bakers"
            width={160}
            height={56}
            className="h-12 w-auto object-contain sm:h-14"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/80">
            Premium sweets, nimco, cakes and bakery products.
          </p>
        </motion.div>
        <motion.div variants={fadeInUp} transition={{ duration: 0.45, ease: easePremium }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/95">Quick Links</p>
          <div className="space-y-2.5 text-sm text-white/80">
            {["Home", "Categories", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Categories" ? "#categories" : "#"}
                className="block transition-colors duration-200 hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
        <motion.div variants={fadeInUp} transition={{ duration: 0.45, ease: easePremium }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/95">Categories</p>
          <div className="space-y-2.5 text-sm text-white/80">
            {["Sweets", "Nimco", "Cakes", "Breads & Buns"].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </motion.div>
        <motion.div variants={fadeInUp} transition={{ duration: 0.45, ease: easePremium }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/95">Contact</p>
          <a
            href={WHATSAPP_ORDER_LINK}
            className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
          >
            WhatsApp Order
          </a>
          <div className="mt-5 flex gap-2.5">
            {["FB", "IG", "YT"].map((item) => (
              <motion.div key={item} whileHover={{ y: -3, scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-xs transition-colors duration-200 hover:border-white/60 hover:bg-white/10"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
