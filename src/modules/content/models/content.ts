import { model } from "@medusajs/framework/utils";

export const BookContent = model.define("book_content", {
  id: model.id().primaryKey(),
  product_id: model.text().searchable(),
  content: model.json(),
  version: model.text().nullable(),
});