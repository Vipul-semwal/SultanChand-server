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
    const { data: author, metadata } = await query.graph({
      entity: "author",
      ...remoteQueryConfig,
    });

    console.log("Query Results:", { author, metadata });

    res.json({
      author,
      count: metadata?.count || 0,
      limit: metadata?.take || 10,
      offset: metadata?.skip || 0,
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({
      message: "Failed to fetch authors",
      error: error.message,
    });
  }
}
