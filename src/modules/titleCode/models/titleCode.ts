import { model } from "@medusajs/framework/utils";

export const TitleCode = model.define("title_code", {
  id: model.id().primaryKey(),
  code:model.text().searchable(),
});