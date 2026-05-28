"use client";

import { areasByCity } from "@/data/locations";
import { City, LocationState, OrderType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationStore extends LocationState {
  isLocationConfirmed: boolean;
  setOrderType: (orderType: OrderType) => void;
  setCity: (city: City) => void;
  setArea: (area: string) => void;
  confirmLocation: () => void;
}

const defaultCity: City = "Karachi";

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      orderType: "delivery",
      city: defaultCity,
      area: areasByCity[defaultCity][0],
      isLocationConfirmed: false,
      setOrderType: (orderType) => set({ orderType }),
      setCity: (city) => set({ city, area: areasByCity[city][0] }),
      setArea: (area) => set({ area }),
      confirmLocation: () => set({ isLocationConfirmed: true }),
    }),
    { name: "noor-bakers-location" },
  ),
);
