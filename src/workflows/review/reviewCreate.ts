import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk";
import ReviewModuleService from "src/modules/reviews/service";
import { Review_MODULE } from "../../modules/reviews/index"
import { ReviewInputTypes } from "./type";
import { Modules } from "@medusajs/framework/utils";

export const CreateReviewStep = createStep(
    "create-Review-step",
    async (input: ReviewInputTypes, { container }) => {
        const ReviewModuleService: ReviewModuleService = container.resolve(
            Review_MODULE
        )
        const Review = await ReviewModuleService.createReviews(input);
        console.log('Reivew ban gyaa',Review)
        const remoteLink = container.resolve("remoteLink");
        const link = {
            [Review_MODULE]: {
                review_id: Review.id,
            },
            [Modules.PRODUCT]: {
                product_id: input.product_id,
            },
        };

        const linked = await remoteLink.create(link);
        console.log('lik ban gaya', linked);
        return new StepResponse(Review, Review.id)
    },
    async (input: string, { container }) => {
        const ReviewModuleService: ReviewModuleService = container.resolve(
            Review_MODULE
        );
        const Review = await ReviewModuleService.deleteReviews(input);
    }
);