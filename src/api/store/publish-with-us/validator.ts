import z from "zod";

export const publishWithUsSchema = z.object({
    author_name: z.string().min(2, "Author name must be at least 2 characters"),
    institute_name: z.string().min(2, "Institute name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    city: z.string().min(2, "City must be at least 2 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    contact_number: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
    discipline: z.string().min(2, "Discipline must be at least 2 characters"),
    synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
    about_author: z.string().min(10, "About author must be at least 10 characters"),
    author_affiliation: z.string().min(2, "Author affiliation must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    pin_zip: z.string().regex(/^\d{5,6}$/, "Pin/Zip must be 5 or 6 digits"),
    title_of_book: z.string().min(2, "Title must be at least 2 characters"),
    subject: z.string().min(2, "Subject must be at least 2 characters"),
    status_of_book: z.string(),
  });
  
  
  export type PublishWithUsFormData = z.infer<typeof publishWithUsSchema>;  

  export const CORS = false