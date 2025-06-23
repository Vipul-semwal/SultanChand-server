import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
import {TitleCodeType,UpdateTitleCodeType} from "./type";
import { CreateTitleCodeStep } from "./titleCodeCreatStep";
import { UpdateTitleCodeStep } from "./titleCodeUpdate";



export const CreateTitleCodenWorkflow = createWorkflow(
    "Create-tc-workflow",
    (Input:TitleCodeType)=>{
        console.log('in the workflow',Input);
        const CreateStep = CreateTitleCodeStep(Input);
        return new WorkflowResponse(CreateStep);
    });

    export const UpdateTitleCodenWorkflow = createWorkflow(
      "update-tc-workFlow",
      (Input:UpdateTitleCodeType)=>{
        console.log('in the workflow',Input);
        const UpdateStep = UpdateTitleCodeStep(Input);
        return new WorkflowResponse(UpdateStep);
    }
    )