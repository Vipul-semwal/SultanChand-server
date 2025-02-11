import { MedusaService } from "@medusajs/framework/utils"
import { BookContent } from "./models/content"

class BookContentService extends MedusaService({
    BookContent,
}) {

}

export default BookContentService;