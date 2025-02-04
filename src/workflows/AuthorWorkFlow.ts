import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { createAuthorStep,CreateAuthorStepInput,linkAuthorToBookStep,linkAuthorInput,
    updateAuthorStepType,UpdateAuthorStep
   } from "./create-author";
 
  

  
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
      console.log('inputhjshdfj',input)
      const linkAuthored = linkAuthorToBookStep(input)
  
      return new WorkflowResponse(linkAuthored)
    }
  );


  export const UpdateAuthorWorkflow = createWorkflow(
    "update-author",
    (input: updateAuthorStepType) => {
      console.log('in the updateworkflwo:',input);
      const updatedAuthor = UpdateAuthorStep(input)
      return new WorkflowResponse(updatedAuthor);
    }
  )