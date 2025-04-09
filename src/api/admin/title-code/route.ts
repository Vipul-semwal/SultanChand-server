import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
import { TitleCodeType,UpdateTitleCodeType } from "./validator";

import { CreateTitleCodenWorkflow,UpdateTitleCodenWorkflow } from "src/workflows/titleCode/titleCodeworkFlow";



  export const POST = async (
      req: MedusaRequest<TitleCodeType>,
      res: MedusaResponse
    ) => {
      // console.log("hhlelel",req.body)
      // res.json({ data: "jana" })
      // return
      console.log('ara ahi',req.validatedBody)
      const { result,errors  } = await CreateTitleCodenWorkflow(req.scope)
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
        req: MedusaRequest<UpdateTitleCodeType>,
        res: MedusaResponse
      )=>{
        console.log('reqqqq',req.validatedBody)
        const { result,errors  } = await UpdateTitleCodenWorkflow(req.scope)
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