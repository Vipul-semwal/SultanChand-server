import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk";
  import BookContentService from "src/modules/content/service";
import { BookContent_MODULE } from "src/modules/content";
import  {UpdateBookContentType} from "./type";
import { Modules } from "@medusajs/framework/utils";

export const UpdateContentStep = createStep(
    "UpdateContentStep",
    async (input:UpdateBookContentType,  { container }) => {
        const bookContentService:BookContentService = container.resolve(BookContent_MODULE);
        const bookContent = await bookContentService.updateBookContents(input);
        console.log('updatehogay',bookContent)
                return new StepResponse(bookContent, bookContent.id)
    })