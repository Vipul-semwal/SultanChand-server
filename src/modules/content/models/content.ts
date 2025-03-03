import { model } from "@medusajs/framework/utils";

export const BookContent = model.define("book_content", {
  id: model.id().primaryKey(),
  content:model.text()
});