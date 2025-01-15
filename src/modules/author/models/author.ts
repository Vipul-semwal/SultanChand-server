import { model } from "@medusajs/framework/utils";

export const Author = model.define("author", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  description: model.text(), 
  image: model.text(),       
  subText: model.text(),    
});
