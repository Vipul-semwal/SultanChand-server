import { string } from "prop-types";
import { z } from "zod"

export const ProductPdfSchema = z.object({
  amazoneLink: z.string().nullable(),
  youtubeLink: z.string().nullable(),
  previewPdf: z.string().nullable(),
  questionBankPdf: z.string().nullable(),
  anypdf: z.any().nullable(),
  product_id: z.string(),
});

export const getLInksofProduct = z.object({
  id:z.string()
})
