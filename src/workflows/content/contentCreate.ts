import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk";
import BookContentService from "src/modules/content/service";
import { BookContent_MODULE } from "src/modules/content";
import  {BookContentType} from "./type";
import { Modules } from "@medusajs/framework/utils";

export const CreateBookContentStep = createStep(
    "CreateBookContentStep",
    async (input:BookContentType,  { container }) => {
        const bookContentService:BookContentService = container.resolve(BookContent_MODULE);
        const bookContent = await bookContentService.createBookContents(input);
        console.log('content ban gyaa',bookContent)
        const remoteLink = container.resolve("remoteLink");
         const link = {
                    [BookContent_MODULE]: {
                        content_id: bookContent.id,
                    },
                    [Modules.PRODUCT]: {
                        product_id: input.product_id,
                    },
                };
                const linked = await remoteLink.create(link);
                console.log('lik ban gaya', linked);
                return new StepResponse(bookContent, bookContent.id)
   
    },
  async (input: string, { container }) => {
    const bookContentService:BookContentService = container.resolve(BookContent_MODULE);
    const bookContent = await bookContentService.deleteBookContents(input);
    }
)