export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string[];
  stock_count: number;
  in_stock: boolean;
  stone_type?: string;
  style?: string;
  occasion?: string;
}
export interface updatedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string[];
  stock_count: number;
  in_stock: boolean;
  stone_type?: string;
  style?: string;
  occasion?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  _id: string;
  id: string;
  firstName:string,
  lastName:string;
  customer: string;
  items: OrderItem[]; 
  amount: number;
  status: "Order Placed" | "Processing" | "Shipped" | "Delivered"; 
  date: string;
}




export const categories = [
  { id: '1', name: 'Luxury Healing', description: 'Premium healing crystals and gemstones' },
  { id: '2', name: 'Fashion', description: 'Affordable AAA quality fashion bracelets' }
];
