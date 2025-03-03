import z from "zod";

const uploadSchema = z.object({
  filename: z.string(),
  ContentType: z.enum(["image/png", "image/jpeg", "image/jpg", "application/pdf"]),
});

export type UploadSchemaType = z.infer<typeof uploadSchema>;

export default uploadSchema;
