import { Module } from "@medusajs/framework/utils"
import specimenRequestModuleService from "./service";

export const specimen_MODULE = "specimen"
export default Module(specimen_MODULE, {
    service: specimenRequestModuleService,
    });
