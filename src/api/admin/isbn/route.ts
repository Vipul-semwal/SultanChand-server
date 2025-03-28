import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
import { CreateIsbnWorkflow,UpdateIsbnWorkflow } from "src/workflows/isbn-create/isbnWorkflow";
import { IsbnType,UpdateIsbnType } from "./validator";



  export const POST = async (
      req: MedusaRequest<IsbnType>,
      res: MedusaResponse
    ) => {
      // console.log("hhlelel",req.body)
      // res.json({ data: "jana" })
      // return
      console.log('ara ahi',req.validatedBody)
      const { result,errors  } = await CreateIsbnWorkflow(req.scope)
        .run({
          input: req.validatedBody,
          throwOnError:false
        })
    
        if (errors.length) {
          console.log('error',errors)
          return res.json({
            errors: errors.map((error) => error.error),
            sucsess:false,message:"something went wrong"
          }).status(500)
      }
      
      res.json({ data: result,sucsess:true,message:"created successfully" })
    };

      export const PUT = async(
        req: MedusaRequest<UpdateIsbnType>,
        res: MedusaResponse
      )=>{
        console.log('reqqqq',req.validatedBody)
        const { result,errors  } = await UpdateIsbnWorkflow(req.scope)
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
      
      res.json({ data: result,sucsess:true,message:"created successfully"  })
      }