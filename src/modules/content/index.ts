import { Module } from "@medusajs/framework/utils"
import BookContentService from "./service"

export const BookContent_MODULE = "content"

export default Module( BookContent_MODULE, {
  service: BookContentService,
});