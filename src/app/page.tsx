import { CartDrawer } from "@/components/cart-drawer";
import { LocationModal } from "@/components/location-modal";
import { OrderSuccessModal } from "@/components/order-success-modal";
import { Navbar } from "@/components/navbar";
import { AuthSection } from "@/sections/auth-section";
import { CategoriesSection } from "@/sections/categories-section";
import { FeaturedProductsSection } from "@/sections/featured-products-section";
import { Footer } from "@/sections/footer";
import { HeroSection } from "@/sections/hero-section";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <AuthSection />
      </main>
      <Footer />
      <LocationModal />
      <CartDrawer />
      <OrderSuccessModal />
    </div>
  );
}
