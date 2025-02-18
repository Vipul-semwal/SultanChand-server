import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
import {CreateBookContentWorkflow,UpdateBookContentWorkflow} from "../../../workflows/content/contentWorkflow";
import {BookContentType} from "../../../workflows/content/type";
import {z} from "zod";
import {contentSchema,UpdatecontentSchema} from "./validator";

type PostAdminCreateBookContentType = z.infer<typeof contentSchema>;
type PutAdminUpdateContentType = z.infer<typeof UpdatecontentSchema>;
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const prodcut = req.scope.resolve('query');
    const {data,metadata} = await prodcut.graph({
      entity:"content",
      fields:[
        "id",   
      ]
    })
    res.json({data:data,lund:"bada hai"})
  };

  export const POST = async (
      req: MedusaRequest<PostAdminCreateBookContentType>,
      res: MedusaResponse
    ) => {
      // console.log("hhlelel",req.body)
      // res.json({ data: "jana" })
      // return
      console.log('ara ahi',req.validatedBody)
      const { result,errors  } = await CreateBookContentWorkflow(req.scope)
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
        req: MedusaRequest<PutAdminUpdateContentType>,
        res: MedusaResponse
      )=>{
        console.log('reqqqq',req.validatedBody)
        const { result,errors  } = await UpdateBookContentWorkflow(req.scope)
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