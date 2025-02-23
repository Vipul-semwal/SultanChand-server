import { 
    defineMiddlewares,
    validateAndTransformBody,
    validateAndTransformQuery,
  } from "@medusajs/framework/http"
    import { z } from "zod"
    import { createFindParams } from "@medusajs/medusa/api/utils/validators"
  import { PostAdminCreateAuthor,linkAuthor,PostAdminUpdateAuthor } from "./admin/authors/validators"
  import {ProductPdfSchema,getLInksofProduct} from "./admin/extralinks/validators"
  import { contentSchema,UpdatecontentSchema } from "./admin/book-content/validator"
  import { reviewSchema } from "./store/validator"
  import multer from "multer";
  const storage = multer.memoryStorage();
const upload = multer({ storage });



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
        matcher: "/admin/authors",
        method: "PUT",
        middlewares: [
          validateAndTransformBody(PostAdminUpdateAuthor),
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
      {
        matcher: "/store/authors",
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
          (req,res,next)=>{
            console.log('middleware',req.remoteQueryConfig)
            next()
          }
        ],
      },
      {
        matcher: "/admin/extralinks",
        method: "POST",
        middlewares: [
          validateAndTransformBody(ProductPdfSchema),
        ],
      },
      {
        matcher: "/admin/extralinks",
        method: "PUT",
        middlewares: [
          validateAndTransformBody(ProductPdfSchema),
        ],
      },
      {
        matcher: "/store/review",
        method: "POST",
        middlewares: [
          validateAndTransformBody(reviewSchema),
        ],
      },
      {
        matcher: "/store/upload",
        middlewares: [upload.single("file")],
      },
      {
        matcher: "/admin/book-content",
        method: "POST",
        middlewares: [
          validateAndTransformBody(contentSchema),
        ],
      },
      {
        matcher: "/admin/book-content",
        method: "PUT",
        middlewares: [
          validateAndTransformBody(UpdatecontentSchema),
        ],
      },
    ],
  })