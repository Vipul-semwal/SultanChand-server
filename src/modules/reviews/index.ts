import { Module } from "@medusajs/framework/utils"
import ReviewModuleService from "./service"

export const Review_MODULE = "review"
export default Module(Review_MODULE, {
    service: ReviewModuleService,
    });
