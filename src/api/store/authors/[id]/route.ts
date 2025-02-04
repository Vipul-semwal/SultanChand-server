import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Author_MODULE } from 'src/modules/author';
import AuthorModuleService from "src/modules/author/service";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const author:AuthorModuleService = req.scope.resolve(Author_MODULE);
    if (!author || typeof author.retrieveAuthor !== "function") {
      throw new Error("Product service is not properly registered or invalid.");
    }

    
   const data = await author.retrieveAuthor(req.params.id);
    console.log("Query Results:", { data });

    res.json({
      data,
    });

    
  } catch (error) {
    console.error("Error fetching author Details:", error);
    res.status(500).json({
      message: "Failed to fetch author Details",
      error: error.message,
    });
  }
}





