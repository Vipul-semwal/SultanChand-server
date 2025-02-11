import { Module } from "@medusajs/framework/utils"
import PublishWithUsSrvice from "./service"

export const PublishWithUs_MODULE = "publishWithUs"

export default Module(PublishWithUs_MODULE, {
  service: PublishWithUsSrvice,
});