import { z } from 'zod';

export const contentSchema = z.object({
  content: z.string(),
  product_id: z.string(),
  });

  export const UpdatecontentSchema = z.object({
    content:z.string(),
    product_id: z.string(),
    id:z.string()
  });
  
  