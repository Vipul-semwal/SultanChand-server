import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { createAuthorStep,CreateAuthorStepInput } from "./create-author";
 
  

  
  export const createAuthorWorkflow = createWorkflow(
    "create-Author",
    (input: CreateAuthorStepInput) => {
      const Author = createAuthorStep(input)
  
      return new WorkflowResponse(Author)
    }
  )