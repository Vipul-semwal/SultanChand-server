import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
import {TitleCodeType,UpdateTitleCodeType} from "./type";
import { CreateTitleCodeStep } from "./titleCodeCreatStep";
import { UpdateTitleCodeStep } from "./titleCodeUpdate";



export const CreateTitleCodenWorkflow = createWorkflow(
    "create-title-workFlow",
    (Input:TitleCodeType)=>{
        console.log('in the workflow',Input);
        const CreateStep = CreateTitleCodeStep(Input);
        return new WorkflowResponse(CreateStep);
    });

    export const UpdateTitleCodenWorkflow = createWorkflow(
      "update-title-workFlow",
      (Input:UpdateTitleCodeType)=>{
        console.log('in the workflow',Input);
        const UpdateStep = UpdateTitleCodeStep(Input);
        return new WorkflowResponse(UpdateStep);
    }
    )