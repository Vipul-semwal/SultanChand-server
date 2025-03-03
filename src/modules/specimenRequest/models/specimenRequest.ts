import { model } from "@medusajs/framework/utils";

export const specimenRequest = model.define("specimen_request", {
  id: model.id().primaryKey(),
  category_name: model.text(), 
  school_name: model.text(), 
  state: model.text(),
  residence_address: model.text(), 
  phone_number: model.text(),
  email: model.text(),
  title_name: model.text(), 
  strength: model.text(),
  name: model.text(),
  school_address: model.text(), 
  city: model.text(),
  pin_code: model.text(),
  mobile_number: model.text(),
  title_category: model.text(), 
  letter_head:model.text(), 
  photo_id: model.text(), 
});
