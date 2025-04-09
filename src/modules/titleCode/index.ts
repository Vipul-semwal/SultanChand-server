import { Module } from "@medusajs/framework/utils"
import TitleCodeService from "./service"

export const titleCode_MODULE = "titleCode";

export default Module( titleCode_MODULE, {
  service: TitleCodeService,
});