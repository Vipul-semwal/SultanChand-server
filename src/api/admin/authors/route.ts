import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { 
    createAuthorWorkflow,
  } from "../../../workflows/AuthorWorkFlow"
  import {z} from "zod"
  import { PostAdminCreateAuthor } from "./validators"
import author from "src/modules/author"
  
  type PostAdminCreateAuthorType = z.infer<typeof PostAdminCreateAuthor>
  
  export const POST = async (
    req: MedusaRequest<PostAdminCreateAuthorType>,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody)
    const { result } = await createAuthorWorkflow(req.scope)
      .run({
        input: req.validatedBody,
      })
  
    res.json({ author: result })
  };

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const query = req.scope.resolve("query")
    const { 
        data: author, 
        metadata
      } = await query.graph({
        entity: "author",
        ...req.remoteQueryConfig,
      })
      console.log("query",author,metadata)
      res.json({ 
        author,
        count: metadata?.count || 0, 
        limit: metadata?.take || 10, 
        offset: metadata?.skip || 0, 
      })
    
  };