import { Module } from "@medusajs/framework/utils"
import BookISBNService from "./service"

export const ISBN_MODULE = "isbn";

export default Module( ISBN_MODULE, {
  service: BookISBNService,
});