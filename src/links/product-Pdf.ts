import ProductPdfModule from "../modules/productPdf"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
 ProductPdfModule.linkable.pdf
)