import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import AuthorModuleService from "src/modules/author/service";
import { Author_MODULE } from "src/modules/author";
import {ISBN_MODULE} from "src/modules/bookIsbn";
import BookISBNService from "src/modules/bookIsbn/service";


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    try {
        const productQueryService = req.scope.resolve("query");
    
        const {name,query} = req.validatedQuery;
        let queries:Array<string> = []
        console.log('hankiikahal',name,query)
        
      
        const authorcontentService:AuthorModuleService  = req.scope.resolve(Author_MODULE)
       if(name === "author"){
        const authors = await  authorcontentService.listAuthors({q:query})
        queries = authors.map((a)=>{
          return a.id
        })
        console.log('lunketoiopee',queries);
       }
       if(name === "isbn"){
        const isbncontentService:BookISBNService  = req.scope.resolve(ISBN_MODULE);
        const isbns = await  isbncontentService.listIsbns({q:query});
        queries = isbns.map((a)=>{
          return a.id
        })
        console.log('lunketoiopee',queries);
       }

        const { data, metadata } = await productQueryService.graph({
          entity:name as string,
          fields: ["products.*",], 
          filters: { id:queries },
        });
        console.log('arabeta benkar',data)
        if (!data || data.length === 0) {
          return res.status(200).json({
            data: [],
            metadata,
            message: "No data found for the provided product queries.",
          });
        }
        console.log('ye dkho jara inko:',data)
        res.status(200).json({
          data,
          metadata,
          message: "book data retrieved successfully.",
        });
      } catch (error) {
        console.error("Error fetching product content:", error);
    
        res.status(500).json({
          error: "Internal Server Error",
          message:
            "An error occurred while retrieving the product data with queries. Please try again later.",
          details: error.message, 
        });
      }
    
    
  };

  export const CORS = false