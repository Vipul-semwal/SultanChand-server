import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import {  PirorityAuthor_MODULE} from "src/modules/priority_author";
  import PriorityAuthorService from 'src/modules/priority_author/service';
  import { shuffleAuthors } from "src/admin/lib/utils";


  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    try {
      const query = req.scope.resolve("query");
  
      // 1. Fetch priority-author list
      const { data } = await query.graph({
        entity: "priority_author",
        fields: ["id", "authors", "keys"],
      });
  
      const authorList = Array.isArray(data?.[0]?.authors?.list)
        ? data[0].authors.list
        : [];
  
      // 2. Clean + sort the list by priority
      const sortedAuthorMeta = [...authorList]
        .filter(a => typeof a.priority === "number")
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 10); // Top 10
  
      const sortedAuthorIds = sortedAuthorMeta.map(a => a.author_id);
  
      // 3. Fetch the authors by those IDs
      const { data: authors } = await query.graph({
        entity: "author",
        fields: ["id", "image", "name","subText","description"],
        filters: { id: [...sortedAuthorIds] },
      });
  
      // 4. Make a lookup table: id → full author object
      const authorMap = new Map(authors.map(a => [a.id, a]));
  
      // 5. Combine + sort final list
      const finalSortedList = sortedAuthorMeta
        .map(meta => {
          const full = authorMap.get(meta.author_id);
          if (!full) return null;
          return {
            ...full,
            priority: meta.priority,
          };
        })
        .filter(Boolean); // Remove any missing authors
    console.log('data')
      return res.json({ data: finalSortedList });
    } catch (error) {
      console.error("Error fetching priority authors:", error);
      return res.status(400).json({
        error: error.message,
        message: "Something went wrong",
      });
    }
  };