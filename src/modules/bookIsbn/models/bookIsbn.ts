import { model } from "@medusajs/framework/utils";

export const Bookisbn = model.define("isbn", {
  id: model.id().primaryKey(),
  number:model.text().searchable()
});