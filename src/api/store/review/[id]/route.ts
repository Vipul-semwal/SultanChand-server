import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const query = req.scope.resolve("query");

    if (!query || typeof query.graph !== "function") {
      throw new Error("Product service is not properly registered or invalid.");
    }

    const { data, metadata } = await query.graph({
      entity: "reviews",
      fields: ["id", "name", "comment", "email", "rating", "created_at"],
      filters: {
        product_id: [req.params.id],
      },
    });

    console.log("Fetched Reviews:", data);

    if (!data || data.length === 0) {
       res.json({
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      });
      return;
    }

    const totalRatings = data.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = totalRatings / data.length;

    res.json({
      data, 
      averageRating: parseFloat(averageRating.toFixed(2)), 
      totalReviews: data.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};
