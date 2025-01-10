import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { Author_MODULE } from "../modules/author"
  import AuthorModuleService from "../modules/author/service"
  
  export type CreateAuthorStepInput = {
    name: string
  }
  
  export const createAuthorStep = createStep(
    "create-Author-step",
    async (input: CreateAuthorStepInput, { container }) => {
      const authorModuleService: AuthorModuleService = container.resolve(
        Author_MODULE
      )
  
      const author = await authorModuleService.createAuthors(input)
  
      return new StepResponse(author, author.id)
    }
  )