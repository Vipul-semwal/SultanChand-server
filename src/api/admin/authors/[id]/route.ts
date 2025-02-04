import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Author_MODULE } from 'src/modules/author';
import AuthorModuleService from "src/modules/author/service";
import { 
    ContainerRegistrationKeys,
  } from "@medusajs/framework/utils";



  export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> {
    console.log('ahay in the delete function',req.params.id);
    try {
      const authorService: AuthorModuleService = req.scope.resolve(Author_MODULE);
      const link = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);
  
      if (!authorService || typeof authorService.deleteAuthors !== "function") {
        throw new Error("Author service is not properly registered or invalid.");
      }
  
      const authorId = req.params.id;
      if (!authorId) {
        res.status(400).json({ message: "Author ID is required." });
        return;
      }
  
      // Step 1: Delete all links related to this author
      await link.delete({
        [Author_MODULE]: { author_id: authorId },
      });
  
      try {
        // Step 2: Delete the author
        await authorService.deleteAuthors([authorId]);
  
        res.json({
          message: "Author deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting author, rolling back links:", error);
  
        // Step 3: Rollback - Restore links if author delete fails
        await link.restore({
          [Author_MODULE]: { author_id: authorId },
        });
  
        res.status(500).json({
          message: "Failed to delete author. Rolled back linked records.",
          error: error.message,
        });
      }
    } catch (error) {
      console.error("Error in delete process:", error);
      res.status(500).json({
        message: "Failed to process delete request.",
        error: error.message,
      });
    }
  }
  
