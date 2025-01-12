import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { 
    linkBookToAuthorWorkflow
  } from "../../../../workflows/AuthorWorkFlow"
  import {z} from "zod"
  import { linkAuthor } from "../validators"
import author from "src/modules/author"
  
  type linkAuthorType = z.infer<typeof linkAuthor>
  
  export const POST = async (
    req: MedusaRequest<linkAuthorType>,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody)
    
    const { result,errors  } = await linkBookToAuthorWorkflow(req.scope)
      .run({input:req.validatedBody,throwOnError:false})
      if (errors.length) {
        return res.json({
          errors: errors.map((error) => error.error),
        }).status(500)
    }
    
  
    res.json({link:result})
  };