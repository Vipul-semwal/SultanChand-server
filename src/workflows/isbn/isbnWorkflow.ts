import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
import {isbnType,UpdateIsbnType} from "../isbn-create/type";
import { CreateIsbnStep } from "../isbn/isbnCreatStep";
import { UpdateIsbnStep } from "../isbn/isbnUpdate";



export const CreateIsbnWorkflow = createWorkflow(
    "createIsbnWorkflow",
    (Input:isbnType)=>{
        console.log('in the workflow',Input);
        const CreateStep = CreateIsbnStep(Input);
        return new WorkflowResponse(CreateStep);
    });

    export const UpdateIsbnWorkflow = createWorkflow(
      "updateIsbnWorkflow",
      (Input:UpdateIsbnType)=>{
        console.log('in the workflow',Input);
        const UpdateStep = UpdateIsbnStep(Input);
        return new WorkflowResponse(UpdateStep);
    }
    )