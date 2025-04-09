import { MedusaService } from "@medusajs/framework/utils"
import { TitleCode } from "./models/titleCode"

class TitleCodeService extends MedusaService({
    titleCode: TitleCode,
}) {

}

export default TitleCodeService;