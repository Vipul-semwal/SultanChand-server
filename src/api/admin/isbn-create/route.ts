import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
import { CreateIsbnWorkflow,UpdateIsbnWorkflow } from "src/workflows/isbn-create/isbnWorkflow";
import { IsbnType,UpdateIsbnType } from "./validator";
import ISBNService from "src/modules/bookIsbn/service";
import { ISBN_MODULE } from "src/modules/bookIsbn";
import { Modules } from "@medusajs/framework/utils";



export const POST = async (
  req: MedusaRequest<IsbnType>,
  res: MedusaResponse
) => {
  let isbnData: any; // Declare isbnData outside try block

  try {
    const isbnService: ISBNService = req.scope.resolve(ISBN_MODULE);
    isbnData = await isbnService.createIsbns(req.validatedBody); // Assign value
    console.log("isbn ban gyaa", isbnData);

    try {
      const remoteLink = req.scope.resolve("remoteLink");
      const link = {
        [Modules.PRODUCT]: {
          product_id: req.validatedBody.product_id,
        },
        [ISBN_MODULE]: {
          isbn_id: isbnData.id, // Using isbnData.id
        },
      };
      const linked = await remoteLink.create(link);
      res.json({ data: isbnData, success: true, message: "Created successfully" });
    } catch (error) {
      console.error("Error creating link:", error);

      // Ensure `isbnData` exists before deleting
      if (isbnData?.id) {
        await isbnService.deleteIsbns(isbnData.id); // Pass `isbnData.id`
      }

      return res.status(500).json({
        errors: "Error creating link",
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.error("Error creating ISBN:", error);
    return res.status(500).json({
      errors: "Error creating data",
      success: false,
      message: "Something went wrong",
    });
  }
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