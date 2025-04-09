import BookContent from "../modules/content"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils";
import isbn from "src/modules/bookIsbn";
import TitleCode from "src/modules/titleCode";

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  TitleCode.linkable.titleCode
)