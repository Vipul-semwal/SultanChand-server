import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { createAuthorStep,CreateAuthorStepInput,linkAuthorToBookStep,linkAuthorInput } from "./create-author";
 
  

  
  export const createAuthorWorkflow = createWorkflow(
    "create-Author",
    (input: CreateAuthorStepInput) => {
      const Author = createAuthorStep(input)
  
      return new WorkflowResponse(Author)
    }
  )

    
  export const linkBookToAuthorWorkflow = createWorkflow(
    "link-book-to-author",
    (input: linkAuthorInput) => {
      console.log('input',input)
      const linkAuthored = linkAuthorToBookStep(input)
  
      return new WorkflowResponse(linkAuthored)
    }
  )