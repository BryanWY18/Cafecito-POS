import {z} from 'zod';

export interface ClientResponse{
  clients: Client[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}

export const clientSchema = z.object({
  _id: z.string(),
  name:z.string(),
  phoneOrEmail: z.string(),
  purchasesCount: z.number().nonnegative(),
  isActive: z.boolean()
});

export type Client = z.infer<typeof clientSchema>;

export const clientArraySchema = z.array(clientSchema);