import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk";
import ISBNService from "src/modules/bookIsbn/service";
import isbn, { ISBN_MODULE } from "src/modules/bookIsbn";
import  {isbnType} from "../isbn-create/type";
import { Modules } from "@medusajs/framework/utils";

export const CreateIsbnStep = createStep(
    "CreateIsbnStep",
    async (input:isbnType,  { container }) => {
        const isbnService:ISBNService = container.resolve(ISBN_MODULE);
        const isbnData = await isbnService.createIsbns(input);
        console.log('isbn ban gyaa',isbnData)
        const remoteLink = container.resolve("remoteLink");
         const link = {
                    [Modules.PRODUCT]: {
                        product_id: input.product_id,
                    },
                    [ISBN_MODULE]: {
                        isbn_id:isbnData.id,
                    },
                };
                const linked = await remoteLink.create(link);
                console.log('lik ban gaya', linked);
                return new StepResponse(isbnData, isbnData.id)
   
    },
  async (input: string, { container }) => {
    const isbnService:ISBNService = container.resolve(ISBN_MODULE);
    const isbnData = await isbnService.deleteIsbns(input);
    }
)