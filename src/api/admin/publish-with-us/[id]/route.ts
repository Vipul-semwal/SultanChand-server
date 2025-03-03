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