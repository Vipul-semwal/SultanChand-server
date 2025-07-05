import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import {  PirorityAuthor_MODULE} from "src/modules/priority_author";
  import PriorityAuthorService from 'src/modules/priority_author/service';
  import { PriorityAuthorFormData,UpdatePriorityAuthorFormData } from "../validate";
  import { shuffleAuthors } from "src/admin/lib/utils";



  export const DELETE = async (
    req: MedusaRequest<{ id: string }>,
    res: MedusaResponse
  ) => {
    try {
      console.log('dlet:',req.params.id)
      const query = req.scope.resolve("query");
      const priorityAuthorService: PriorityAuthorService = req.scope.resolve(PirorityAuthor_MODULE);
  
      // 🧠 Step 1: Get existing priority author list
      const { data } = await query.graph({
        entity: "priority_author",
        fields: ["id", "authors", "keys"],
      });
  
      const authorList = Array.isArray(data?.[0]?.authors?.list)
        ? data[0].authors.list
        : [];
  
      const targetId = req.params.id; // The author_id to be deleted
  
      // ❌ Step 2: Remove the author being deleted
      const filteredList = authorList.filter(
        (author) => author.author_id !== targetId
      );
  
      // 🔁 Step 3: Sort by current priority and reassign fresh priorities
      const reshuffled = [...filteredList]
        .sort((a, b) => a.priority - b.priority)
        .map((author, index) => ({
          ...author,
          priority: index + 1,
        }));
  
      // 💾 Step 4: Save updated list to DB
      const result = await priorityAuthorService.updatePriorityAuthors({
        id: data[0]?.id || "",
        authors: { list: reshuffled },
        key: "global-key",
      });
  
      // 📦 Step 5: Respond
      return res.json({
        success: true,
        message: "Author removed and priority list reshuffled",
        result: reshuffled,
      });
    } catch (error) {
      console.error("❌ Error in deleting priority author:", error);
      return res.status(400).json({
        error: error.message,
        message: "Something went wrong",
      });
    }
  };
  