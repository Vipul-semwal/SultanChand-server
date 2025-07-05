import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import {  PirorityAuthor_MODULE} from "src/modules/priority_author";
  import PriorityAuthorService from 'src/modules/priority_author/service';
  import { PriorityAuthorFormData,UpdatePriorityAuthorFormData } from "./validate";
  import { shuffleAuthors } from "src/admin/lib/utils";


export const POST = async (
    req: MedusaRequest<PriorityAuthorFormData>,
    res: MedusaResponse
  ) =>{
    console.log('priotydata:',req.validatedBody);
    try {
        const query = req.scope.resolve("query");
         const { data, metadata } = await query.graph({
      entity: "priority_author",
      fields: ["id", "authors", "keys"],
    });

    console.log('query:', data)
     const priorityAuthorService:PriorityAuthorService = req.scope.resolve( PirorityAuthor_MODULE)
        // Ensure data[0] is defined and has the expected structure
        if (
          data[0] &&
          typeof data[0] === "object" &&
          "authors" in data[0] &&
          data[0].authors &&
          "list" in data[0].authors &&
          Array.isArray(data[0].authors.list) &&
          data[0].authors.list.length >= 10
        ) {
            return res.status(400).json({ error: "Priority author list exceed", message: "Priority author list exceed, max 10" });
        }

        if(data.length < 1){
            console.log("zero authors found, creating new priority author");
        const result = await priorityAuthorService.createPriorityAuthors({authors:{list:[{author_id :req.validatedBody.author_id,priority: data.length + 1}]},key:"global-key"});
        console.log("result", result);
        return res.json({success:true,message:"added to priority list",result});
        };

 const authorList = Array.isArray(data?.[0]?.authors?.list)
  ? data[0].authors.list
  : []

const newAuthorId = req.validatedBody.author_id;

const authorExists = authorList.some(author => author.author_id === newAuthorId);

if (authorExists) {
  return res.status(400).json({
    message: "Author already exists in priority list",
    error: "same"
  });
}
        const result = await priorityAuthorService.updatePriorityAuthors({
            id: data[0]?.id || "",
            authors: {list:[...authorList, {author_id: newAuthorId, priority: authorList.length + 1}]},
            key: "global-key"
        });
        console.log("result", result);
        return res.json({success:true,message:"added to priority list",result});
    } catch (error) {
        console.error('Error creating priority author:', error);
        return res.status(400).json({ error: error.message, message: "Something went wrong" });
    }   
  }

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

export const PATCH = async (
    req: MedusaRequest<UpdatePriorityAuthorFormData>,
    res: MedusaResponse
  ) => {
    try {
      console.log('data:',req.validatedBody )
         const query = req.scope.resolve("query");
      const { data, metadata } = await query.graph({
        entity: "priority_author",
        fields: ["id", "authors", "keys"],
      });
    //   sort the data by priority in descending order
      const authorList = Array.isArray(data?.[0]?.authors?.list)
  ? data[0].authors.list
  : []

          const newList = shuffleAuthors(authorList, {
        [req.validatedBody.author_id]: +req.validatedBody.priority,
      });

      const priorityAuthorService: PriorityAuthorService = req.scope.resolve(PirorityAuthor_MODULE);
       const result = await priorityAuthorService.updatePriorityAuthors({
            id: data[0]?.id || "",
            authors: {list:[...newList]},
            key: "global-key"
        });
        console.log("result", result);
      return res.json({ success: true, message: "Priority updated successfully", result });
    } catch (error) {
      console.error("Error updating priority author:", error);
      return res.status(400).json({ error: error.message, message: "Something went wrong" });
    }
  };



