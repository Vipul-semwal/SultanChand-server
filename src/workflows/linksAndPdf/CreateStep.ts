import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import {ExtraLink_MODULE} from "src/modules/extraPdfLink";
  import LinkAndPdfModuleService from "src/modules/extraPdfLink/service";
  import { PdfAndLinkType} from "./type";

 export const creatLinkAndPdfStep = createStep("create-pdf-link-step",
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
          console.log('inside createstep',input);

          const PdfLInk = await PdfLinkModuleService.createExtraLinks(pdfObj);
         const sehowmany = await PdfLinkModuleService.listExtraLinks();
         
          console.log('seehwomany',sehowmany);
     
          return new StepResponse({product_id:input.product_id,pdfLink_id:PdfLInk.id}, PdfLInk.id);
    },
    async (input: string,{ container }) => {
        // wip write a componsation for delteing the 
        const PdfLinkModuleService:LinkAndPdfModuleService = container.resolve(ExtraLink_MODULE);
    
         await PdfLinkModuleService.deleteExtraLinks(input);
      },
 )