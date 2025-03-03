import { MedusaService } from "@medusajs/framework/utils"
import { Bookisbn } from "./models/bookIsbn"

class BookISBNService extends MedusaService({
    isbn:Bookisbn,
}) {

}

export default BookISBNService;