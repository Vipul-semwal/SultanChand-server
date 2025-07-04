import { model } from "@medusajs/framework/utils";

export const PriorityAuthor = model.define("priority_author", {
  id: model.id().primaryKey(),
 authors: model.json().default({list: []}),
  priority: model.number(),   
    key: model.text().unique()
});
