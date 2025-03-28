import z from "zod";

// Schema for isbnType
export const isbnSchema = z.object({
  product_id: z.string(), 
  number: z.string(),
});

export type IsbnType = z.infer<typeof isbnSchema>;

export const updateIsbnSchema = z.object({
    id: z.string(), 
  number: z.string(),
});

export type UpdateIsbnType = z.infer<typeof updateIsbnSchema>;
