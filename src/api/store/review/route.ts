import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {z} from "zod"
import { reviewSchema } from "../validator";
import { CreateReviewWorkflow } from "src/workflows/review/reviewWorkflow";

type ReviewSchemaType = z.infer<typeof reviewSchema>;
export interface ReviewQueryParams {
  productId: string;
  offset: number;
  limit: number;
}
export const POST = async(
    req:MedusaRequest<ReviewSchemaType>,
    res:MedusaResponse
)=>{
    console.log('in the route', req.validatedBody);
     const { result,errors  } = await CreateReviewWorkflow(req.scope)
          .run({
            input: {
                ...req.validatedBody,
                product_id: req.validatedBody.prouduct_id,
            },
            throwOnError:false
          })
      
          if (errors.length) {
            console.log('error',errors)
            return res.json({
              errors: errors.map((error) => error.error),
            }).status(500)
        }
        
        res.json({ data: result })
};

export const GET = async(
  req:MedusaRequest,
  res:MedusaResponse
): Promise<void>=>{
  try {
      const query = req.scope.resolve("query");
      console.log('in the route ababy')
       const remoteQueryConfig = req.remoteQueryConfig || {};
      if (!query || typeof query.graph !== "function") {
        throw new Error("Product service is not properly registered or invalid.");
      }
       console.log('query',req.query)
       const reviewQueryParams: ReviewQueryParams = req.query as unknown as ReviewQueryParams;
      const {data,metadata} = await query.graph({
          entity:"reviews",
          fields:["id","name","comment","email","created_at","rating"],
          filters:{
            product_id:[reviewQueryParams.productId]
          },
          pagination:{
            skip:+reviewQueryParams.offset,
             take:+reviewQueryParams.limit
          }
        
      })

      console.log('jo bhe ia',data)
  
      res.json({
        data,
        count: metadata?.count || 0,
        limit: metadata?.take || 10,
        offset: metadata?.skip || 0,
        
      });
  
      
    } catch (error) {
      console.error("Error fetching author Details:", error);
      res.status(500).json({
        message: "Failed to fetch author Details",
        error: error.message,
      });
    }
      

};