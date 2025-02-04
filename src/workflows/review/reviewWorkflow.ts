import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
  import { CreateReviewStep } from "./reviewCreate";
  import { ReviewInputTypes } from "./type";
 

export const CreateReviewWorkflow = createWorkflow(
    "create-review-work-flow",
    (Input:ReviewInputTypes)=>{
        console.log('in the workflow',Input);
    const CreateStep = CreateReviewStep(Input);
       return new WorkflowResponse(CreateStep);
    }
)