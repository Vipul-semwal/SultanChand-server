import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";



export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    console.log('reqqqq',req.validatedBody);
   try {
    const query = req.scope.resolve("query")
    const { 
        data, 
        metadata
      } = await query.graph({
        entity: "publish",
        ...req.remoteQueryConfig,
      })
      console.log("query",data,metadata)
      res.json({ 
        data,
        count: metadata?.count || 0, 
        limit: metadata?.take || 10, 
        offset: metadata?.skip || 0, 
        sucess:true
      })
   } catch (error) {
       console.log('error',error)
       return res.status(400).json({ error: error.message,message:"something went wrong" });
       
   }
  }; 