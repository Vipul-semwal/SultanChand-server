import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { LinkDefinition } from "@medusajs/framework/types"
import { Author_MODULE } from "../../modules/author"
import AuthorModuleService from "../../modules/author/service"

createProductsWorkflow.hooks.productsCreated(
  (async ({ products, additional_data }, { container }) => {
    console.log('productsCreated hook', additional_data)
    if (!additional_data?.author_id) {
      return new StepResponse([], [])
    }

    const authorModuleService:AuthorModuleService = container.resolve(
      Author_MODULE
    )
    // if the Author doesn't exist, an error is thrown.
    await authorModuleService.retrieveAuthor(additional_data.author_id as string)

    const remoteLink = container.resolve("remoteLink")
    const logger = container.resolve("logger")
    
    const links: LinkDefinition[] = []
    
    for (const product of products) {
      links.push({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [Author_MODULE]: {
          author_id: additional_data.author_id,
        },
      })
    }
    
    await remoteLink.create(links)
    
    logger.info("Linked Author to products")
    
    return new StepResponse(links, links)
  })
)