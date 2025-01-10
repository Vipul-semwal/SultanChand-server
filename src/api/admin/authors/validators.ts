import { z } from "zod"

export const PostAdminCreateAuthor = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  subText: z.string(),
})