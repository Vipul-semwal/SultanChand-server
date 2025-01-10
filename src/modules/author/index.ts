import { Module } from "@medusajs/framework/utils"
import AuthorModuleService from "./service"

export const Author_MODULE = "author"

export default Module(Author_MODULE, {
  service: AuthorModuleService,
});