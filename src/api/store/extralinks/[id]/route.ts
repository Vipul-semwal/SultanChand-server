import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Author_MODULE } from 'src/modules/author';


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    try {

        const productQueryService = req.scope.resolve("query");
    
        const productId = req.params.id;
        if (!productId) {
          return res.status(400).json({
            error: "Product ID is required.",
            message: "Please provide a valid product ID in the request parameters.",
          });
        }
    
        const { data, metadata } = await productQueryService.graph({
          entity: "product",
          fields: ["extra_link.*", "author.*"], 
          filters: { id: [productId] },
        });
    
        if (!data || data.length === 0) {
          return res.status(200).json({
            data: [],
            metadata,
            message: "No data found for the provided product ID.",
          });
        }
    
        res.status(200).json({
          data,
          metadata,
          message: "Product data retrieved successfully.",
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
    
        res.status(500).json({
          error: "Internal Server Error",
          message:
            "An error occurred while retrieving the product data. Please try again later.",
          details: error.message, 
        });
      }
    
    
  };