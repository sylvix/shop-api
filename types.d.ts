export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
}

export type ProductWithoutId = Omit<Product, 'id'>;