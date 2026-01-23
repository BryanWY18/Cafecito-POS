import { z } from 'zod';
import { clientSchema } from './Client';
import { productSchema } from './Products';

// SCHEMA PARA CREAR VENTA (REQUEST al backend)
export const createSaleRequestSchema = z.object({
  customer: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(), // Solo ID
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),  
  paymentMethod: z.string(),
  subTotal: z.number(),
  discountPercent: z.number().int().min(0).max(100),
  discountAmount: z.number(),
  total: z.number().nonnegative(),
});

// SCHEMA PARA LA VENTA (RESPONSE del backend)
export const saleSchema = z.object({
  _id: z.string(),
  customer: clientSchema.optional(),
  items: z.array(z.object({
    productId: productSchema,
    quantity: z.number().min(1),
    price: z.number().min(0),
    _id: z.string().optional()
  })),
  total: z.number().min(0),
  paymentMethod: z.string().optional(),
  subTotal: z.number().optional(),
  discountPercent: z.number().optional(),
  discountAmount: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional()
});

export type CreateSaleRequest = z.infer<typeof createSaleRequestSchema>;
export type Sale = z.infer<typeof saleSchema>;
export const saleArraySchema = z.array(saleSchema);