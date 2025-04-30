import z from "zod";
export const specimenRequestSchema = z.object({
  category_name: z.string().min(1, "Category Name is required").optional(),
  school_name: z.string().min(1, "School/College/Coaching Name is required"),
  state: z.string().min(1, "State is required"),
  residence_address: z.string().min(1, "Residence Address is required").optional(),
  phone_number: z.string().min(10, "Phone Number must be at least 10 digits").optional(),
  email: z.string().email("Invalid email format"),
  title_name: z.string().min(1, "Title Name is required"),
  strength: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  school_address: z.string().min(1, "School Address is required"),
  city: z.string().optional(),
  pin_code: z.string().min(1, "Pin Code is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  title_category: z.string().min(1, "Title Category is required"),
  letter_head: z.any().optional(), 
  photo_id: z.any().optional(),
});

export type specimenFormData = z.infer<typeof specimenRequestSchema>;
