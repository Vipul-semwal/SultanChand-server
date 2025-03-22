import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
import {PublishRequest_MODULE} from "../../../../modules/publishRequest/index"
import PublishRequestService from "src/modules/publishRequest/service";


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody);
   try {
    const query = req.scope.resolve("query");
    const {id} = req.params
    const { 
        data, 
      } = await query.graph({
        entity: "publish",
       fields:['*'],
       filters:{id:[id]}
      })
      console.log("query",data)
      res.json({ 
        data,
        sucess:true
      })
   } catch (error) {
       console.log('error',error)
       return res.status(400).json({ error: error.message,message:"something went wrong" });
       
   }
  }; 

  export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> {
    console.log('ahay in the delete function',req.params.id);       
    try {
       const PublishService: PublishRequestService  = req.scope.resolve(PublishRequest_MODULE);
  
      const Id = req.params.id;
      if (!Id) {
        res.status(400).json({ message: "Publishwithus ID is required." });
        return;
      }

      await PublishService.deletePublishes(Id);
      res.json({
        message: "deleted successfully.",
      });

    } catch (error) {
      console.error("Error in delete process:", error);
      res.status(500).json({
        message: "Failed to process delete request.",
        error: error.message,
      });
    }
  }