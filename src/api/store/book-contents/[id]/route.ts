import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
// import BookContent_MODULE from 'src/modules/content'


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
          fields: ["book_content.*"], 
          filters: { id: [productId] },
        });
        console.log('arabeta benkar',data)
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
          message: "Product content  retrieved successfully.",
        });
      } catch (error) {
        console.error("Error fetching product content:", error);
    
        res.status(500).json({
          error: "Internal Server Error",
          message:
            "An error occurred while retrieving the product content. Please try again later.",
          details: error.message, 
        });
      }
    
    
  };

  // export const CORS = false