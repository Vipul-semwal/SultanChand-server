import { model } from "@medusajs/framework/utils";

export const ExtraLink = model.define("ExtraLink", {
  id: model.id().primaryKey(),
  amazoneLink: model.text().nullable(),
  youtubeLink: model.text().nullable(),
  previewPdf: model.text().nullable(),
  questionBankPdf: model.text().nullable(),
  anypdf: model.json().nullable(),
});
