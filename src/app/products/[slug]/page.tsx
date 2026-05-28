import { products } from "@/data/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/sections/footer";
import { LocationModal } from "@/components/location-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductDetailsClient } from "./product-details-client";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} - Premium Bakery | Noor Bakers`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Noor Bakers`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ProductDetailsClient product={product} />
      </main>
      <Footer />
      <LocationModal />
      <CartDrawer />
    </div>
  );
}
