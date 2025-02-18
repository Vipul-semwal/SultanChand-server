import { z } from 'zod';

export const contentSchema = z.object({
  version: z.string().optional(),
  content: z.array(z.object({
    title: z.string().min(1),
    content: z.union([
      z.string(), 
      z.array(z.object({
        title: z.string().min(1),
        content: z.union([z.string(), z.array(z.lazy(() => contentSchema.shape.content))]), 
        order: z.number(),
      }))
    ]),
    order: z.number(),
  })),
  product_id: z.string(),
  });

  export const UpdatecontentSchema = z.object({
    version: z.string().optional(),
    content: z.array(z.object({
      title: z.string().min(1),
      content: z.union([
        z.string(), 
        z.array(z.object({
          title: z.string().min(1),
          content: z.union([z.string(), z.array(z.lazy(() => contentSchema.shape.content))]), 
          order: z.number(),
        }))
      ]),
      order: z.number(),
    })),
    product_id: z.string(),
    id:z.string()
  });
  
  