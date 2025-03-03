import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import { PublishRequest_MODULE } from "src/modules/publishRequest";
import PublishRequestService from 'src/modules/publishRequest/service';
import { PublishWithUsFormData } from "./validator";

export const POST = async (
    req: MedusaRequest<PublishWithUsFormData>,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody);
   try {
    const publishRequest:PublishRequestService = req.scope.resolve(PublishRequest_MODULE)
    const data = await publishRequest.createPublishes(req.validatedBody)
       console.log('bangaabhenchdoo:',data)
       return res.json({sucsess:true,message:"created successfully"});
   } catch (error) {
       console.log('error',error)
       return res.status(400).json({ error: error.message,message:"something went wrong" });
       
   }
  }; 