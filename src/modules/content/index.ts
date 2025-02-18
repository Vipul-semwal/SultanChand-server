import { Module } from "@medusajs/framework/utils"
import BookContentService from "./service"

export const BookContent_MODULE = "book_content"

export default Module( BookContent_MODULE, {
  service: BookContentService,
});