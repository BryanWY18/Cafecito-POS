import z from 'zod';

export interface UsersResponse {
  message: string;
  users: User[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const userSchema = z.object({
  _id: z.string(),
  displayName: z.string(),
  email: z.string(),
  role: z.enum(['admin', 'seller']),
  isActive: z.boolean(),
});

export const userArraySchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;

// export type userCerdentials = {email:string, password:string}
export type UserCredentials = Pick<User, 'email'> & { password: string };

export type UserForm = Pick<
  User,
  'email' | 'displayName'
> & { password: string };

export type LoginResponse = {
  token: string;
  refreshToken: string;
};