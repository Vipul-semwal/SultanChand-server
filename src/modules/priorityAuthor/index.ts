import { Module } from "@medusajs/framework/utils"
import PriorityAuthorModuleService from "./service"

export const PirorityAuthor_MODULE = "pirority_author"

export default Module(PirorityAuthor_MODULE, {
  service: PriorityAuthorModuleService,
});