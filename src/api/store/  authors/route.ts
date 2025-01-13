import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { 
    createAuthorWorkflow,
  } from "../../../workflows/AuthorWorkFlow"

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const query = req.scope.resolve("query")
    const { 
        data: author, 
        metadata
      } = await query.graph({
        entity: "author",
        ...req.remoteQueryConfig,
      })
      console.log("query",author,metadata)
      res.json({ 
        author,
        count: metadata?.count || 0, 
        limit: metadata?.take || 10, 
        offset: metadata?.skip || 0, 
      })
  };