export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  dimensions?: string;
  material?: string;
  styleNotes?: string;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  address: string;
  landmark?: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Database {
  users: User[];
  products: Product[];
  orders: Order[];
}
