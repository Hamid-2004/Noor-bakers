"use client";

import { PremiumImage } from "@/components/premium-image";
import { assets } from "@/lib/assets";
import { useUiStore } from "@/store/use-ui-store";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function AuthSection() {
  const { authMode, setAuthMode } = useUiStore();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="bg-[#f5f5f5] px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#0b2c5d]/10 ring-1 ring-[#d9d9d9]/60 md:grid-cols-2">
        <div className="relative hidden min-h-[420px] md:block">
          <PremiumImage
            src={assets.auth.showcase}
            alt="Noor Bakers bakery interior"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0b2c5d]/10 to-[#0b2c5d]/35" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">Noor Bakers</p>
            <p className="mt-2 text-2xl font-semibold text-white">Crafted with care, served fresh.</p>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-6 flex rounded-xl bg-[#f5f5f5] p-1">
            <button
              onClick={() => setAuthMode("login")}
              className={`w-1/2 rounded-lg py-2 text-sm transition-colors ${
                authMode === "login" ? "bg-white text-[#0b2c5d] shadow-sm" : "text-[#0b2c5d]/70"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={`w-1/2 rounded-lg py-2 text-sm transition-colors ${
                authMode === "register" ? "bg-white text-[#0b2c5d] shadow-sm" : "text-[#0b2c5d]/70"
              }`}
            >
              Register
            </button>
          </div>
          <form className="space-y-4">
            {authMode === "register" && (
              <input
                placeholder="Full Name"
                className="w-full rounded-xl border border-[#d9d9d9] px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-colors focus:border-[#0b2c5d]"
              />
            )}
            <input
              placeholder="Email Address"
              className="w-full rounded-xl border border-[#d9d9d9] px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-colors focus:border-[#0b2c5d]"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-[#d9d9d9] px-4 py-3 pr-11 text-sm text-[#0b2c5d] outline-none transition-colors focus:border-[#0b2c5d]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0b2c5d]/70"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#0b2c5d]/80">
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9d9d9]" />
              Remember me
            </label>
            <button className="w-full rounded-xl bg-[#0b2c5d] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#082249]">
              {authMode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
