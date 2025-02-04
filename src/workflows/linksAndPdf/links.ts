import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import {ExtraLink_MODULE} from "src/modules/extraPdfLink";
  import LinkAndPdfModuleService from "src/modules/extraPdfLink/service";
  import { Modules } from "@medusajs/framework/utils";
// import pdfAndLink from "src/modules/Links";
  
export const LinkProduct_pdf_link_Step = createStep("link-product-pdfLinks",
    async(input:{pdfLink_id:string,product_id:string},{ container })=>{
        const PdfLinkModuleService:LinkAndPdfModuleService = container.resolve(ExtraLink_MODULE);
        console.log('inside linstep',input)
    //    wip chekc for product also
        if(!PdfLinkModuleService.retrieveExtraLink(input.pdfLink_id)){
            throw new Error("Product PdfLink module not found")
        };
        const remoteLink = container.resolve("remoteLink"); 
        const link = {
                 [Modules.PRODUCT]: {
                        product_id: input.product_id,
                      },
                      [ExtraLink_MODULE]: {
                        extra_link_id: input.pdfLink_id,
                      } }
        
     
      
      const linked = await remoteLink.create(link);
      console.log('linked bro',linked);
  })