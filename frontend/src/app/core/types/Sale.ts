import { z } from 'zod';
import { clientSchema } from './Client';
import { productSchema } from './Products';
import { tick } from '@angular/core/testing';

// SCHEMA PARA CREAR VENTA (REQUEST al backend)
export const createSaleRequestSchema = z.object({
  customerId: z.string().optional().nullable(),
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

const ticketSchema = z.object({
  saleId: z.string(),
  timestamp: z.string(),
  storeName: z.string(),
  items: z.array(z.object({
    name: z.string(),
    qty: z.number(),
    unitPrice: z.number(),
    lineTotal: z.number()
  })),
  subtotal: z.number(),
  discount: z.string(), // "5% (-$2.00)"
  total: z.number(),
  paymentMethod: z.string()
});


// SCHEMA PARA LA VENTA (RESPONSE del backend)
export const saleSchema = z.object({
  saleId: z.string(),
  customerId: clientSchema.optional(),
  items: z.array(z.object({
    productId: productSchema,
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    _id: z.string().optional()
  })),
  subtotal: z.number().optional(),
  paymentMethod: z.string().optional(),
  discountPercent: z.number().optional(),
  discountAmount: z.number().optional(),
  total: z.number().min(0),
  ticket: ticketSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional()
});

export type CreateSaleRequest = z.infer<typeof createSaleRequestSchema>;
export type Sale = z.infer<typeof saleSchema>;
export const saleArraySchema = z.array(saleSchema);