import BookContent from "../modules/content"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils";
import isbn from "src/modules/bookIsbn";

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
  },
  isbn.linkable.isbn
)