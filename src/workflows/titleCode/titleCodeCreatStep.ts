import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk";
import  { titleCode_MODULE } from "src/modules/titleCode";
import  {TitleCodeType} from "./type";
import { Modules } from "@medusajs/framework/utils";
import TitleCodeService from '../../modules/titleCode/service';

export const CreateTitleCodeStep = createStep(
    "create_title_code_step",
    async (input:TitleCodeType,  { container }) => {
        const titelCodeService:TitleCodeService = container.resolve(titleCode_MODULE);
        const titleCodeData = await titelCodeService.createTitleCodes(input);
        console.log('title code ',titleCodeData);
        const remoteLink = container.resolve("remoteLink");
         const link = {
                    [Modules.PRODUCT]: {
                        product_id: input.product_id,
                    },
                    [titleCode_MODULE]: {
                        title_code_id:titleCodeData.id,
                    },
                };
                const linked = await remoteLink.create(link);
                console.log('lik ban gaya', linked);
                return new StepResponse(titleCodeData.id, titleCodeData.id)
   
    },
  async (input: string, { container }) => {
    const titelCodeService:TitleCodeService = container.resolve(titleCode_MODULE);
    const titleCodeData = await titelCodeService.deleteTitleCodes(input);
    }
)