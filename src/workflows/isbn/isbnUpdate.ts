import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk";
import ISBNService from "src/modules/bookIsbn/service";
import isbn, { ISBN_MODULE } from "src/modules/bookIsbn";
import  {UpdateIsbnType} from "./type";

export const UpdateIsbnStep = createStep(
    "UpdateIsbnStep",
    async (input:UpdateIsbnType,  { container }) => {
        const isbnService:ISBNService = container.resolve(ISBN_MODULE);
        const isbnData = await isbnService.updateIsbns(input);
                return new StepResponse(isbnData)
    }
)