import z from "zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

const queryparamsSchema = z.object({
    name: z.string(),
   query:z.string()
});

const findParams = createFindParams();

export const combinedParams = findParams.merge(queryparamsSchema);