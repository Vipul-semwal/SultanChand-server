import { model } from "@medusajs/framework/utils";

export const PriorityAuthor = model.define("priorityAuthor", {
  id: model.id().primaryKey(),
 authors: model.json().default({list: []}),
    key: model.text().unique()
});
