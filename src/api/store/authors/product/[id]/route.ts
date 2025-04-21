import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const query = req.scope.resolve("query");
    if (!query || typeof query.graph !== "function") {
      throw new Error("Query service is not properly registered or invalid.");
    }

    const remoteQueryConfig = req.remoteQueryConfig || {};
    const { data: author } = await query.graph({
      entity: "product",
      fields:['author.*'],
      filters: { id: [req.params.id] },
    });

    console.log("Query Results:", author.map(product => product.author));

    res.json({
      author: author.map(product => product.author),
    });
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({
      message: "Failed to fetch author",
      error: error.message,
    });
  }
}