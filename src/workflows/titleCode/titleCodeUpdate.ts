import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk";
import  titleCode, { titleCode_MODULE } from "src/modules/titleCode";
import { Modules } from "@medusajs/framework/utils";
import TitleCodeService from '../../modules/titleCode/service';
import  {UpdateTitleCodeType} from "./type";

export const UpdateTitleCodeStep = createStep(
    "Update_title_code_step",
    async (input:UpdateTitleCodeType,  { container }) => {
        const titelCodeService:TitleCodeService = container.resolve(titleCode_MODULE);
        const titleCodeData = await titelCodeService.updateTitleCodes(input);
                return new StepResponse(titleCodeData);
    }
)