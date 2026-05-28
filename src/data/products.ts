import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "mix-nimco",
    slug: "mix-nimco",
    name: "Mix Nimco",
    category: "nimco",
    image: "/products/nimco-packaging.png",
    description: "Our signature Mix Nimco is a perfect crunchy blend of traditional Pakistani savory snacks, including premium quality sev, peanuts, roasted lentils, and spices. Packaged fresh to preserve its crispy texture.",
    price: 650,
    stock: 25,
    featured: true,
    gallery: ["/products/nimco-packaging.png", "/categories/nimco.png"]
  },
  {
    id: "gulab-jamun",
    slug: "gulab-jamun",
    name: "Gulab Jamun",
    category: "sweets",
    image: "/products/sweet-box.jpeg",
    description: "Indulge in our soft, warm Gulab Jamuns made with rich milk-solids (khoya), fried to golden perfection, and steeped in aromatic cardamom-infused sugar syrup. A classic treat for celebrations.",
    price: 890,
    stock: 15,
    featured: true,
    gallery: ["/products/sweet-box.jpeg", "/categories/sweets.png"]
  },
  {
    id: "milk-bread",
    slug: "milk-bread",
    name: "Milk Bread",
    category: "breads",
    image: "/categories/bread-and-buns.png",
    description: "Super soft, fluffy, and freshly baked every morning. Our Milk Bread has a subtle sweetness and rich milky texture that makes it perfect for breakfast toasts and kids' sandwiches.",
    price: 320,
    stock: 40,
    featured: true,
    gallery: ["/categories/bread-and-buns.png", "/categories/placeholder.svg"]
  },
  {
    id: "chocolate-cake",
    slug: "chocolate-cake",
    name: "Chocolate Cake",
    category: "cakes",
    image: "/products/cakes.png",
    description: "Decadent layers of rich, moist chocolate sponge cake filled and frosted with our signature premium chocolate ganache. A chocolate lover's absolute dream.",
    price: 2400,
    stock: 8,
    featured: true,
    gallery: ["/products/cakes.png", "/categories/cakes.png"]
  },
  {
    id: "spring-rolls",
    slug: "spring-rolls",
    name: "Spring Rolls",
    category: "fried",
    image: "/categories/spring-rolls.png",
    description: "Golden, crispy spring rolls filled with a delicious savory mixture of seasoned shredded chicken and fresh garden vegetables. Perfect for a quick evening snack.",
    price: 780,
    stock: 20,
    featured: true,
    gallery: ["/categories/spring-rolls.png", "/categories/fried-items.png"]
  },
  {
    id: "cake-rusk",
    slug: "cake-rusk",
    name: "Cake Rusk",
    category: "rusk",
    image: "/products/cake-rusk-packaging.png",
    description: "Double-baked to golden perfection, our crispy Cake Rusks are light, sweet, and crunchy. The ultimate accompaniment to your daily cup of tea or coffee.",
    price: 540,
    stock: 30,
    featured: true,
    gallery: ["/products/cake-rusk-packaging.png", "/categories/cake-rusk.png"]
  },
  {
    id: "butter-biscuits",
    slug: "butter-biscuits",
    name: "Butter Biscuits",
    category: "biscuits",
    image: "/categories/biscuits.png",
    description: "Delicate and crumbly cookies made with real cream butter, offering a rich melt-in-the-mouth texture. Baked with love for the perfect afternoon snack.",
    price: 450,
    stock: 35,
    featured: false,
    gallery: ["/categories/biscuits.png", "/categories/placeholder.svg"]
  },
  {
    id: "frozen-samosa",
    slug: "frozen-samosa",
    name: "Frozen Samosa",
    category: "frozen",
    image: "/categories/frozen-items.png",
    description: "Our ready-to-fry Frozen Samosas are filled with dynamically spiced potatoes, green peas, and herbs in a light, flaky pastry wrapper. Convenient and delicious.",
    price: 680,
    stock: 15,
    featured: false,
    gallery: ["/categories/frozen-items.png", "/categories/placeholder.svg"]
  }
];

export const featuredProducts = products.filter(product => product.featured);
