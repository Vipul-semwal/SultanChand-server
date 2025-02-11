import { Request, Response } from "express";
import { fileservice } from "@medusajs/medusa";

export const POST = async (req: Request, res: Response) => {
  const fileService: fileservice = req.scope.resolve("file");

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await fileService.upload(req.file);
    res.status(200).json({ url: result.url });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};
