import { z } from "zod"

export const PostAdminCreateAuthor = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  subText: z.string(),
})

export const linkAuthor = z.object({
  author_id: z.string(),
  product_id: z.string(),
})