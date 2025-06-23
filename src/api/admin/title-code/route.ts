import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
import { TitleCodeType,UpdateTitleCodeType } from "./validator";

import { CreateTitleCodenWorkflow,UpdateTitleCodenWorkflow } from "src/workflows/titleCode/titleCodeworkFlow";



 export const POST = async (
  req: MedusaRequest<TitleCodeType>,
  res: MedusaResponse
) => {
  const { result, errors } = await CreateTitleCodenWorkflow.run({
    input: req.validatedBody,
    container: req.scope, // 🟢 Correct way to inject container
    throwOnError: false,
  });

  if (errors.length) {
    return res.status(500).json({
      errors: errors.map((e) => e.error),
      success: false,
      message: "Something went wrong",
    });
  }

  res.json({ data: result, success: true, message: "Created successfully" });
};

    export const PUT = async (
  req: MedusaRequest<UpdateTitleCodeType>,
  res: MedusaResponse
) => {
  const { result, errors } = await UpdateTitleCodenWorkflow.run({
    input: req.validatedBody,
    container: req.scope, // 🟢 Must inject container here
    throwOnError: false,
  });

  if (errors.length) {
    return res.status(500).json({
      errors: errors.map((e) => e.error),
      success: false,
      message: "Something went wrong",
    });
  }

  res.json({ data: result, success: true, message: "Updated successfully" });
};


    
     