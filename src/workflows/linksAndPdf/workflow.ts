import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
  import {creatLinkAndPdfStep} from './CreateStep'
  import { LinkProduct_pdf_link_Step} from "./links";
  import { UpdateLinkStep } from "./UdateStep";
import { PdfAndLinkType} from "./type"


export const createLinkAndPdfWorkFlow = createWorkflow(
    "createLinkAndPdfWorkFlow",
    (input:PdfAndLinkType)=>{
        console.log('in the workflow',input);
        const createLinkAndpdfStep =  creatLinkAndPdfStep(input);
        const linkPdfStep = LinkProduct_pdf_link_Step(createLinkAndpdfStep);
        return new WorkflowResponse(createLinkAndpdfStep);
    }
);

export const UpdateLinksWorkFlow = createWorkflow
("updateLinksWorkFlow",
    (Input:PdfAndLinkType)=>{
        console.log('in the workflow bba',);
        console.log("in the update workflow",Input);
        const updateStep = UpdateLinkStep(Input);
        return new WorkflowResponse(updateStep);
    }
)