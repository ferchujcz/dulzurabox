export interface Category {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  category?: Category;
}
