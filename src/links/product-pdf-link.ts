import LinksAndPdfMoudle from "../modules/extraPdfLink"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  LinksAndPdfMoudle.linkable.extraLink
)