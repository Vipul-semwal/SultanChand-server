import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import{createLinkAndPdfWorkFlow,UpdateLinksWorkFlow } from "../../../workflows/linksAndPdf/workflow" 
  import {z} from "zod"
  import {ProductPdfSchema,getLInksofProduct} from "./validators"

  type PostAdminCreateProductPdfType = z.infer<typeof ProductPdfSchema>
  type GetLinksType = z.infer<typeof getLInksofProduct>

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const prodcut = req.scope.resolve('query');
    const {data,metadata} = await prodcut.graph({
      entity:"extralinks",
      fields:[
        "id",
        
      ]
    })
    res.json({data:data,lund:"bada hai"})
    
    
  };
  
  export const POST = async (
    req: MedusaRequest<PostAdminCreateProductPdfType>,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody)
    const { result,errors  } = await createLinkAndPdfWorkFlow(req.scope)
      .run({
        input: req.validatedBody,
        throwOnError:false
      })
  
      if (errors.length) {
        console.log('error',errors)
        return res.json({
          errors: errors.map((error) => error.error),
        }).status(500)
    }
    
    res.json({ data: result })
  };

  export const PUT = async(
    req: MedusaRequest<PostAdminCreateProductPdfType>,
    res: MedusaResponse
  )=>{
    console.log('reqqqq',req.validatedBody)
    const { result,errors  } = await UpdateLinksWorkFlow(req.scope)
    .run({
      input: req.validatedBody,
      throwOnError:false
    })

    if (errors.length) {
      console.log('error',errors)
      return res.json({
        errors: errors.map((error) => error.error),
      }).status(500)
  }
  
  res.json({ data: result })
  }

