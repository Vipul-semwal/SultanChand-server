import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import {ExtraLink_MODULE} from "src/modules/extraPdfLink";
  import LinkAndPdfModuleService from "src/modules/extraPdfLink/service";
  import { PdfAndLinkType} from "./type"

  export const UpdateLinkStep = createStep("update-pdf-link-step",
    async(input:PdfAndLinkType,{container})=>{
        const PdfLinkModuleService:LinkAndPdfModuleService = container.resolve(ExtraLink_MODULE);
        const query = container.resolve("query");
        const pdfObj = {
            amazoneLink:input.amazoneLink,
            youtubeLink: input.youtubeLink,
            previewPdf: input.previewPdf, 
            questionBankPdf: input.questionBankPdf,
            anypdf:input.anypdf
          };
          console.log('inside createstep',pdfObj);
          
          const UpdatedLink = await PdfLinkModuleService.updateExtraLinks({
            id: input.product_id, // First, clear old data
            anypdf: null,  
          });
          console.log('UpdatedLink',UpdatedLink);
          
          const FinalUpdatedLink = await PdfLinkModuleService.updateExtraLinks({
            id: input.product_id,
            ...pdfObj,
          });
          console.log('FinalUpdatedLink',FinalUpdatedLink); 
     
          return new StepResponse(FinalUpdatedLink,);
    },
 )