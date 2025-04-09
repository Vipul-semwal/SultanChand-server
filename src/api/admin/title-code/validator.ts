import { z } from "zod";

// TitleCodeType schema
export const TitleCodeSchema = z.object({
  product_id: z.string(),
  code: z.string(),
});

export type TitleCodeType = z.infer<typeof TitleCodeSchema>;

// UpdateTitleCodeType schema
export const UpdateTitleCodeSchema = z.object({
  id: z.string(),
  code: z.string(),
});

export type UpdateTitleCodeType = z.infer<typeof UpdateTitleCodeSchema>;
