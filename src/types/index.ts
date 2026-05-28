export type OrderType = "delivery" | "pickup";
export type City = "Karachi" | "Lahore" | "Islamabad";

export interface LocationState {
  orderType: OrderType;
  city: City;
  area: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  gallery?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
