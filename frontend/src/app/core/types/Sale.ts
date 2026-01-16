import {z} from 'zod';

export const saleSchema = z.object({
  _id: z.string(),
  customerId: z.string(),
  PaymentMethod: z.string(),
  subTotal: z.number(),
  discountPercent: z.number().int(),
  disconuntAmount: z.number(),
  total: z.number().nonnegative()
});

export type Sale = z.infer<typeof saleSchema>;

export const saleArraySchemma = z.array(saleSchema);