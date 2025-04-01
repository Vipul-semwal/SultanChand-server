import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
import {isbnType,UpdateIsbnType} from "../isbn/type";
import { CreateIsbnStep } from "./isbnCreateStep";
import { UpdateIsbnStep } from "./isbnUpdatetep";



export const CreateIsbnWorkflow = createWorkflow(
    "createIsbn-create-Workflow",
    (Input:isbnType)=>{
        console.log('in the workflow',Input);
        const CreateStep = CreateIsbnStep(Input);
        return new WorkflowResponse(CreateStep);
    });

    export const UpdateIsbnWorkflow = createWorkflow(
      "updateIsb-create-nWorkflow",
      (Input:UpdateIsbnType)=>{
        console.log('in the workflow',Input);
        const UpdateStep = UpdateIsbnStep(Input);
        return new WorkflowResponse(UpdateStep);
    }
    )