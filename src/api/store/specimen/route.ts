import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import { specimenFormData } from "./validator";
  import { specimen_MODULE } from "src/modules/specimenRequest";
import specimenRequestModuleService from '../../../modules/specimenRequest/service';
import { INotificationModuleService } from "@medusajs/framework/types";
import { Modules } from '@medusajs/framework/utils';

 export const POST = async (
     req: MedusaRequest<specimenFormData>,
     res: MedusaResponse
   ) => {
     console.log('reqqqq',req.validatedBody);
    try {
        const specimenService:specimenRequestModuleService =  req.scope.resolve(
            specimen_MODULE
        );

        const notificationModuleService: INotificationModuleService = req.scope.resolve(Modules.NOTIFICATION);
        const data = await specimenService.createSpecimenRequests(req.validatedBody);
        console.log('bangaabhenchdoo:',data)
        await notificationModuleService.createNotifications({
          to: "admin@example.com",
          channel: "in-app",
          template: "order-placed",
          data,
        });
        return res.json({sucsess:true,message:"created successfully"});
    } catch (error) {
        console.log('error',error)
        return res.status(400).json({ error: error.message,message:"something went wrong" });
        
    }
   }; 

  //  export const CORS = false