import { 
    defineMiddlewares,
    validateAndTransformBody,
    validateAndTransformQuery,
  } from "@medusajs/framework/http"
    import { z } from "zod"
    import { createFindParams } from "@medusajs/medusa/api/utils/validators"
  import { PostAdminCreateAuthor,linkAuthor } from "./admin/authors/validators"


  export const GetAuthorSchema = createFindParams()
  
  export default defineMiddlewares({
    routes: [
      {
        matcher: "/admin/authors",
        method: "POST",
        middlewares: [
          validateAndTransformBody(PostAdminCreateAuthor),
        ],
      },
      {
        matcher: "/admin/authors/link",
        method: "POST",
        middlewares: [
          validateAndTransformBody(linkAuthor),
        ],
      },
      {
        matcher: "/admin/products",
        method: ["POST"],
        additionalDataValidator: {
          author_id: z.string().optional(),
        },
      },
      {
        matcher: "/admin/authors",
        method: "GET",
        middlewares: [
          validateAndTransformQuery(
            GetAuthorSchema,
            {
              defaults: [
                "id",
                "name",
                "description",
                "image",
                "subText",
                "products.*",
              ],
              isList: true,
            }
          ),
        ],
      },
  
    ],
  })