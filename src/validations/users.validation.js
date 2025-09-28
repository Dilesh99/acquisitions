import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255).trim().optional(),
  email: z.email('Invalid email format').max(255).trim().transform((val) => val.toLowerCase()).optional(),
  role: z.enum(['user', 'admin'], 'Role must be either user or admin').optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});