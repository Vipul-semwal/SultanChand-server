import { z } from "zod"

export const reviewSchema = z.object({
    rating: z.number().min(1, "Please provide a rating").max(5, "Rating cannot exceed 5"),
    comment: z.string().min(5, "Comment must be at least 5 characters long"),
    prouduct_id: z.string().min(1, "Book ID is required"),
    email: z.string().email("Please provide a valid email address"),
    name: z.string().min(1, "Name is required"),
  });

