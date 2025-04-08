import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import AuthorModuleService from "src/modules/author/service";
  import { Author_MODULE } from "src/modules/author";

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    try {
      const authorcontentService: AuthorModuleService = req.scope.resolve(Author_MODULE);
      
      // Extract validated query parameters
      const { query, limit, offset } = req.validatedQuery;
      console.log('query',query)
      
      // Pass pagination params to service
      const  authors = await authorcontentService.listAuthors(
        { q: query },
        { 
          take: limit,   // Equivalent to "limit"
          skip: offset   // Equivalent to "offset"
        }
      );
      console.log("query",authors)
  
      res.json({ 
        author:authors,
        // count,         // Total number of authors (for pagination)
        limit,         // Current page size
        offset         // Current offset
      });
      
    } catch (error) {
      console.error("Error fetching author content:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "An error occurred while processing your request.",
      });
    }
  }