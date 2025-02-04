import { Module } from "@medusajs/framework/utils"
import ExtraLinkModuleService from "./service"

export const ExtraLink_MODULE = "extralinks"

export default Module(ExtraLink_MODULE, {
  service:ExtraLinkModuleService
})