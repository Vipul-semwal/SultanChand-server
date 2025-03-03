import { Module } from "@medusajs/framework/utils"
import PublishRequestService from "./service"

export const PublishRequest_MODULE = "publish";

export default Module(PublishRequest_MODULE, {
  service: PublishRequestService,
});