import { model } from "@medusajs/framework/utils";

export const PublishWithUs = model.define("publish_with_us", {
  id: model.id().primaryKey(),
  authorName: model.text().searchable(),
  instituteName: model.text().searchable(),
  email: model.text().searchable(),
  city: model.text().searchable(),
  country: model.text().searchable(),
  contactNumber: model.text(),
  discipline: model.text().searchable(),
  synopsis: model.text(),
  aboutAuthor: model.text(),
  authorAffiliation: model.text(),
  address: model.text(),
  state: model.text(),
  pinZip: model.text(),
  titleOfBook: model.text().searchable(),
  subject: model.text().searchable(),
  statusOfBook: model.enum(["Draft", "Published", "Under Review"]),
});
