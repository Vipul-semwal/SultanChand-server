import { z } from "zod"

export const PostAdminCreateAuthor = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  subText: z.string(),
})

export const PostAdminUpdateAuthor = z.object({
  id:z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  subText: z.string(),
})
export const linkAuthor = z.object({
  author_id: z.string(),
  product_id: z.string(),
})

const ProductPdfSchema = z.object({
  amazoneLink: z.string().nullable(),
  youtubeLink: z.string().nullable(),
  previewPdf: z.string().nullable(),
  questionBankPdf: z.string().nullable(),
  anypdf: z.any(),
  product_id: z.string(),
});
