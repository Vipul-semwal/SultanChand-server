import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {putObject} from "src/service/s3"
import { UploadSchemaType } from "./validator";

export const POST = async (
  req: MedusaRequest<UploadSchemaType>,
  res: MedusaResponse
): Promise<void> => {
  try {
   const {filename,ContentType} = req.validatedBody;
//    console.log("dhnadhanahdn:",filename,ContentType)
    const url = await putObject(filename,ContentType);
    // console.log('commadn:',url)
    res.status(200).json({
        data:url,
        success:true
    })

  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Failed to upload review",
      error: error.message,
      ssuccess:false
    });
  }
};
