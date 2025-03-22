import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import specimenRequestModuleService from "src/modules/specimenRequest/service";
  import { specimen_MODULE } from "src/modules/specimenRequest";



export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
   try {
    const query = req.scope.resolve("query");
    const {id} = req.params
    console.log('reqqqq',id);
    const { 
        data, 
      } = await query.graph({
        entity: "specimen_request",
       fields:['email',"phone_number","photo_id","letter_head","residence_address","title_category","name",
        "school_address",
        "*"
       ],
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
       const SpecimenService: specimenRequestModuleService  = req.scope.resolve(specimen_MODULE );
  
      const Id = req.params.id;
      if (!Id) {
        res.status(400).json({ message: " SpecimenService ID is required." });
        return;
      }

      await SpecimenService.deleteSpecimenRequests(Id);
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