"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SuccessModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("order-success") === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b2c5d]/40 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center relative border border-[#0b2c5d]/10"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-[#0b2c5d]/60 transition hover:bg-[#f5f5f5] hover:text-[#0b2c5d]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-50 p-4 text-green-600 mb-4 animate-bounce">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-[#0b2c5d]">Order Formatted!</h2>
              <p className="text-sm text-[#0b2c5d]/70 mt-2 max-w-xs text-center leading-relaxed">
                Your order has been prepared. Please send the pre-filled message in WhatsApp to confirm your delivery with our representative.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 w-full rounded-2xl bg-[#0b2c5d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#082249] shadow-md shadow-[#0b2c5d]/10"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OrderSuccessModal() {
  return (
    <Suspense fallback={null}>
      <SuccessModalContent />
    </Suspense>
  );
}
