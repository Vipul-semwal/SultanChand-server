import { model } from "@medusajs/framework/utils";

export const ProductPdf = model.define("pdf", {
  id: model.id().primaryKey(),
 amazoneLink: model.text(),
 youtubeLink: model.text(),
 previewPdf: model.text(),
 questionBankPdf: model.text(),
 anypdf:model.json(),
});
