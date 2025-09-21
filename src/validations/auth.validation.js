import {z} from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required').trim(),
  email: z.email().max(255).trim().transform((val) => val.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  role: z.enum(['user', 'admin']).default('user'),

});

export const signinSchema = z.object({
  email: z.email().trim().transform((val) => val.toLowerCase()),
  password: z.string().min(1),
}); 