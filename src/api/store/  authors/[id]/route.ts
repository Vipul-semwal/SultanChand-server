import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
 import { Author_MODULE } from "src/modules/author";
import AuthorModuleService from "src/modules/author/service";

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
   try{
    const author:AuthorModuleService = req.scope.resolve(Author_MODULE)
    const data = await author.retrieveAuthor(req.params.id)
      
      res.json({ 
       data:data
      })
   }
    catch(err){
     res.json({ 
        error:err,
        msg:"something went wrong"
      }).status(500)
  }}