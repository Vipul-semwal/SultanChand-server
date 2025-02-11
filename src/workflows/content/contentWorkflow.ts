import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
import {CreateBookContentStep} from "./contentCreate"
import {BookContentType,UpdateBookContentType} from "./type";
import {UpdateContentStep} from "./updateContent";


export const CreateBookContentWorkflow = createWorkflow(
    "createBookContent",
    (Input:BookContentType)=>{
        console.log('in the workflow',Input);
        const CreateStep = CreateBookContentStep(Input);
        return new WorkflowResponse(CreateStep);
    });

    export const UpdateBookContentWorkflow = createWorkflow(
      "updateBookContent",
      (Input:UpdateBookContentType)=>{
        console.log('in the workflow',Input);
        const UpdateStep = UpdateContentStep(Input);
        return new WorkflowResponse(UpdateStep);
    }
    )