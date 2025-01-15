import { model } from "@medusajs/framework/utils";

export const Review = model.define("review", {
    id: model.id().primaryKey(),
    rating: model.number(),
    comment: model.text(), 
    bookId: model.text(),       
    userId: model.text(),    
});