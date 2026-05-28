"use client";

import { create } from "zustand";

interface UiStore {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  authMode: "login",
  setAuthMode: (mode) => set({ authMode: mode }),
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
