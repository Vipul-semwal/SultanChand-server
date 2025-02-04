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
import { UpdateAuthorWorkflow } from "src/workflows/AuthorWorkFlow";
import { updateAuthorStepType } from "src/workflows/create-author";
  
  type PostAdminCreateAuthorType = z.infer<typeof PostAdminCreateAuthor>
  
  export const POST = async (
    req: MedusaRequest<PostAdminCreateAuthorType>,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody)
    const { result,errors } = await createAuthorWorkflow(req.scope)
      .run({
        input: req.validatedBody,
        throwOnError:false
      },)
      if(errors.length){
        return res.json({
          errors: errors.map((error) => error.error),
        }).status(500)
      }
  
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

   export async function PUT(
      req: MedusaRequest,
      res: MedusaResponse
    ) {
      try {
        console.log('reqqqqupdated',req.validatedBody)
           const { result,errors  } = await   UpdateAuthorWorkflow (req.scope)
           .run({
             input: req.validatedBody as updateAuthorStepType,
             throwOnError:false
           })
       
           if (errors.length) {
             console.log('error',errors)
             return res.json({
               errors: errors.map((error) => error.error),
             }).status(500)
         }
         
         res.json({ data: result })
    
      } catch (error) {
        console.error("Error updating author:", error);
        res.status(500).json({
          message: "Failed to updated data",
          error: error.message,
        });
      }
    };