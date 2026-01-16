import {z} from 'zod';

export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});

export type Product = z.infer<typeof productSchema>

export type ProductResponse = {
  products: Product[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number; 
    totalResults: number;
  };
};

export const productArraySchema = z.array(productSchema);