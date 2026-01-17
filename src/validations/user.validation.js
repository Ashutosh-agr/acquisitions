import { z } from 'zod';

export const patchUserSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  email: z.string().max(255).toLowerCase().trim().optional(),
  password: z.string().min(6).max(128).optional(),
  role: z.enum(['admin', 'user']).optional(),
});
