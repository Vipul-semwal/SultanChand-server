import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { Author_MODULE } from "../modules/author"
  import AuthorModuleService from "../modules/author/service"
  import { Modules } from "@medusajs/framework/utils"
  
  export type CreateAuthorStepInput = {
    name: string
  }

  export type linkAuthorInput = {
    author_id: string
    product_id: string
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
  );

  export const linkAuthorToBookStep = createStep(
    "link-author-to-book-step",
    async (input: linkAuthorInput, { container }) => {
      const authorModuleService: AuthorModuleService = container.resolve(
        Author_MODULE
      )
      if(!authorModuleService.retrieveAuthor(input.author_id)){
        throw new Error("Author not found")
      }
      await authorModuleService.retrieveAuthor(input.author_id)
      const remoteLink = container.resolve("remoteLink");
      const logger = container.resolve("logger")

      // remove if already linked
      await  remoteLink.dismiss({
        [Modules.PRODUCT]: {
          product_id: input.product_id,
        },
        [Author_MODULE]: {
          author_id: input.author_id,
        },
      })
  
      // link
      const link = {
        [Modules.PRODUCT]: {
          product_id: input.product_id,
        },
        [Author_MODULE]: {
          author_id: input.author_id,
        },
      }

      await remoteLink.create(link);

      return new StepResponse(link, link)
    }
  );
  
  const added = "test"


