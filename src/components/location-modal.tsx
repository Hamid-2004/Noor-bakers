"use client";

import { PremiumImage } from "@/components/premium-image";
import { areasByCity, cities } from "@/data/locations";
import { assets } from "@/lib/assets";
import { useLocationStore } from "@/store/use-location-store";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed } from "lucide-react";
import { useMemo, useState } from "react";

export function LocationModal() {
  const { isLocationConfirmed, orderType, city, area, setOrderType, setCity, setArea, confirmLocation } =
    useLocationStore();
  const [search, setSearch] = useState("");

  const filteredAreas = useMemo(
    () => areasByCity[city].filter((item) => item.toLowerCase().includes(search.toLowerCase())),
    [city, search],
  );

  return (
    <AnimatePresence>
      {!isLocationConfirmed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b2c5d]/40 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl shadow-[#0b2c5d]/20 sm:p-8"
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <PremiumImage
                src={assets.logo.main}
                alt="Noor Bakers"
                width={120}
                height={120}
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                priority
              />
              <h2 className="mt-3 text-2xl font-semibold text-[#0b2c5d]">Select Your Location</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 rounded-2xl bg-[#f5f5f5] p-1.5">
                {(["delivery", "pickup"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium capitalize transition ${
                      orderType === type ? "bg-white text-[#0b2c5d] shadow" : "text-[#0b2c5d]/70"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9d9d9] p-3 text-sm font-medium text-[#0b2c5d] transition hover:bg-[#f5f5f5]">
                <LocateFixed className="h-4 w-4" />
                Use Current Location
              </button>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value as (typeof cities)[number])}
                className="w-full rounded-2xl border border-[#d9d9d9] px-4 py-3 text-sm text-[#0b2c5d] outline-none focus:border-[#0b2c5d]"
              >
                {cities.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search area"
                className="w-full rounded-2xl border border-[#d9d9d9] px-4 py-3 text-sm text-[#0b2c5d] outline-none focus:border-[#0b2c5d]"
              />
              <select
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="w-full rounded-2xl border border-[#d9d9d9] px-4 py-3 text-sm text-[#0b2c5d] outline-none focus:border-[#0b2c5d]"
              >
                {filteredAreas.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button
                onClick={confirmLocation}
                className="w-full rounded-2xl bg-[#0b2c5d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#082249]"
              >
                Continue Ordering
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
