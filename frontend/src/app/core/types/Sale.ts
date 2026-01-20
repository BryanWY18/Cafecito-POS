import { z } from 'zod';
import { clientSchema } from './Client';
import { productSchema } from './Products';

export const createSaleSchema = z.object({
  customer: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),  
  paymentMethod: z.string(),
  subTotal: z.number(),
  discountPercent: z.number().int().min(0).max(100),
  discountAmount: z.number(),
  total: z.number().nonnegative(),
});

export const saleSchema = z.object({
  _id: z.string(),
  customer: clientSchema,
  items: z.array(z.object({
    productId: productSchema,
    quantity: z.number().min(1),
    price: z.number().min(0),
    _id: z.string().optional()
  })),
  total: z.number().min(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional()
});

export type CreateSale = z.infer<typeof createSaleSchema>;
export type Sale = z.infer<typeof saleSchema>;
export const saleArraySchema = z.array(saleSchema);