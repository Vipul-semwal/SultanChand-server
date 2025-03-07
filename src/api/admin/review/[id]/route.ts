import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ReviewModuleService from "src/modules/reviews/service";
import { Review_MODULE } from "src/modules/reviews";

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

export const Delete = async(req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void>=>{
    const reviewService:ReviewModuleService = req.scope.resolve(Review_MODULE);
    try {
        const review = await reviewService.deleteReviews(req.params.id);
        res.json({message:"Deleted sucsessfully"});
        } catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({
                message: "Failed to delete review",
                error: error.message,
                });
            }

}

// export const CORS = false