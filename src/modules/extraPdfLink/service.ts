import { MedusaService } from "@medusajs/framework/utils"
import {ExtraLink  } from "./models/extraPdfLink"

class ExtraLinksModuleService extends MedusaService({
  ExtraLink,
}) {

}

export default ExtraLinksModuleService