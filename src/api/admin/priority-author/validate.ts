import z from "zod";

//  author_id: model.text().searchable(),
//   priority: model.number(),   
export const priorityAuthorSchema = z.object({
  author_id: z.string().min(1, "Author ID is required"),

});

export const UpdatepriorityAuthorSchema = z.object({
  author_id: z.string().min(1, "Author ID is required"),
  priority: z.number().min(1, "Priority is required"),

});

export type PriorityAuthorFormData = z.infer<typeof priorityAuthorSchema>;