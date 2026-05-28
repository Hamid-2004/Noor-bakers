"use client";

import { PremiumImage } from "@/components/premium-image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/sections/footer";
import { LocationModal } from "@/components/location-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { areasByCity, cities } from "@/data/locations";
import { useCartStore } from "@/store/use-cart-store";
import { useLocationStore } from "@/store/use-location-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { City } from "@/types";
import { ArrowLeft, CheckCircle2, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const locationState = useLocationStore();
  const isHydrated = useHydrated();
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<City>("Karachi");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync with Location Store when hydrated
  useEffect(() => {
    if (isHydrated && locationState) {
      if (locationState.city) {
        setCity(locationState.city);
      }
      if (locationState.area) {
        setArea(locationState.area);
      }
    }
  }, [isHydrated, locationState]);

  // Update area when city changes
  const handleCityChange = (selectedCity: City) => {
    setCity(selectedCity);
    setArea(areasByCity[selectedCity]?.[0] || "");
  };

  const filteredAreas = useMemo(() => {
    return areasByCity[city] || [];
  }, [city]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const deliveryFee = 150; // flat delivery fee placeholder
  const total = subtotal + deliveryFee;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(03\d{9}|\+923\d{9})$/.test(phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Enter a valid Pakistani mobile number (e.g. 03001234567)";
    }
    if (!address.trim()) newErrors.address = "Complete address is required";
    if (!area) newErrors.area = "Please select your area";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Format WhatsApp Order Message
    const orderItemsText = items
      .map((item) => `• ${item.quantity}x ${item.name} (PKR ${item.price * item.quantity})`)
      .join("\n");

    const message = `*Noor Bakers - New Order*
=========================

*Customer Information:*
- *Name:* ${name}
- *Phone:* ${phone}
- *City:* ${city}
- *Area:* ${area}
- *Delivery Address:* ${address}

*Items Ordered:*
${orderItemsText}

*Order Summary:*
- *Subtotal:* PKR ${subtotal}
- *Delivery Fee:* PKR ${deliveryFee}
- *Grand Total:* PKR ${total}
- *Payment Method:* Cash on Delivery (COD)

=========================
Please confirm my order. Thank you!`;

    const whatsappPhone = "923001234567"; // Noor Bakers phone number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    // Clear the cart
    clearCart();

    // Redirect to order success message page or home
    setIsSubmitting(false);
    router.push("/?order-success=true");
  };

  // If page is not hydrated, render a loading state
  if (!isHydrated) {
    return (
      <div className="bg-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#0b2c5d]/70 text-sm font-medium">Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
          <div className="rounded-full bg-[#f5f5f5] p-6 mb-6">
            <ShoppingBag className="h-12 w-12 text-[#0b2c5d]/30" />
          </div>
          <h2 className="text-2xl font-bold text-[#0b2c5d]">Your Cart is Empty</h2>
          <p className="text-sm text-[#0b2c5d]/60 mt-2 max-w-sm">
            You must add at least one delicious Noor Bakers product before checking out.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-2xl bg-[#0b2c5d] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#082249] transition-all"
          >
            Go Back to Shop
          </Link>
        </main>
        <Footer />
        <LocationModal />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 bg-[#f5f5f5]/30 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-white p-2 text-[#0b2c5d] shadow-sm border border-[#0b2c5d]/10 hover:bg-[#f5f5f5] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0b2c5d] sm:text-3xl">Checkout</h1>
              <p className="text-xs text-[#0b2c5d]/60 mt-0.5">Complete your details to place order on WhatsApp</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Form Section */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#0b2c5d]/10 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#0b2c5d] mb-6">Delivery Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#0b2c5d] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full rounded-2xl border ${errors.name ? "border-red-500 focus:border-red-500" : "border-[#d9d9d9] focus:border-[#0b2c5d]"} px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-all bg-white`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#0b2c5d] mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className={`w-full rounded-2xl border ${errors.phone ? "border-red-500 focus:border-red-500" : "border-[#d9d9d9] focus:border-[#0b2c5d]"} px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-all bg-white`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-[#0b2c5d] mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value as City)}
                      className="w-full rounded-2xl border border-[#d9d9d9] focus:border-[#0b2c5d] px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-all bg-white"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="area" className="block text-sm font-semibold text-[#0b2c5d] mb-1.5">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className={`w-full rounded-2xl border ${errors.area ? "border-red-500 focus:border-red-500" : "border-[#d9d9d9] focus:border-[#0b2c5d]"} px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-all bg-white`}
                    >
                      <option value="">Select Area</option>
                      {filteredAreas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    {errors.area && <p className="text-xs text-red-500 mt-1 font-medium">{errors.area}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-[#0b2c5d] mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter house/apartment number, street name, building description"
                    className={`w-full rounded-2xl border ${errors.address ? "border-red-500 focus:border-red-500" : "border-[#d9d9d9] focus:border-[#0b2c5d]"} px-4 py-3 text-sm text-[#0b2c5d] outline-none transition-all bg-white resize-none`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1 font-medium">{errors.address}</p>}
                </div>

                <div className="border-t border-[#0b2c5d]/10 pt-6">
                  <div className="flex items-center gap-3 bg-[#f5f5f5] p-4 rounded-2xl border border-[#0b2c5d]/5">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0b2c5d]">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-[#0b2c5d]/60 mt-0.5">Pay in cash when our rider delivers your order.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0b2c5d] py-4 text-center text-sm font-bold text-white shadow-lg shadow-[#0b2c5d]/10 transition-all hover:bg-[#082249] hover:shadow-xl disabled:bg-[#d9d9d9] hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  {isSubmitting ? "Generating Order..." : "Confirm & Order via WhatsApp"}
                </button>
              </form>
            </div>

            {/* Sticky Summary Section */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#0b2c5d]/10 p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-[#0b2c5d] mb-6">Order Summary</h2>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center py-2 border-b border-[#0b2c5d]/5 last:border-b-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5] border border-[#0b2c5d]/5">
                      <PremiumImage
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-[#0b2c5d] text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#0b2c5d]/60 mt-0.5">
                        PKR {item.price} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-[#0b2c5d] text-sm">
                      PKR {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#0b2c5d]/10 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#0b2c5d]/70">
                  <span>Subtotal</span>
                  <span>PKR {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#0b2c5d]/70">
                  <span>Delivery Fee</span>
                  <span>PKR {deliveryFee}</span>
                </div>
                <div className="border-t border-[#0b2c5d]/5 pt-2 flex justify-between text-[#0b2c5d] font-bold text-base sm:text-lg">
                  <span>Total Amount</span>
                  <span>PKR {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <LocationModal />
      <CartDrawer />
    </div>
  );
}
