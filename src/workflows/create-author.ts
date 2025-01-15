import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { Author_MODULE } from "../modules/author"
  import AuthorModuleService from "../modules/author/service"
  import { Modules } from "@medusajs/framework/utils"
  import { sdk } from '../admin/lib/sdk';

  export type CreateAuthorStepInput = {
    name: string
  }

  export type linkAuthorInput = {
    author_id: string
    product_id: string
  }

  type AuthorLinkRecord =  {
    id: string;
    name: string;
    description: string;
    image: string;
    subText: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
  
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
      const Product = container.resolve("product");
      const query = container.resolve("query");
      const logger = container.resolve("logger")
      console.log('allh hu akbar',)

      // remove if already linked
      // wip imporve the remove queyr see if we can do it in one query withouth looping all authros and get the exact author id
      const { data } = await query.graph({
        entity: Modules.PRODUCT,
        fields: [
          "author.*",
        ],
      })

     // loop over every query then remove the author id
      const author = data[0]?.author as unknown as AuthorLinkRecord[]
      if(author.length>0){
        for(let i=0;i<author.length;i++){
        const res =   await  remoteLink.dismiss({
            [Modules.PRODUCT]: {
              product_id: input.product_id,
            },
            [Author_MODULE]: {
              author_id: author[i].id,
            },
          })
          console.log('res',res)
        }
      }
  
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


