import { model } from "@medusajs/framework/utils";

export const Review = model.define("review", {
    id: model.id().primaryKey(),
    rating: model.number(),
    comment: model.text(), 
    product_id: model.text(),       
   email:model.text(),
   name:model.text(),    
});