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
  import { combinedParams } from "./store/serch/validator";
  import uploadSchema from './store/upload/validator';
  import {specimenRequestSchema} from "./store/specimen/validator";
  import { publishWithUsSchema } from "./store/publish-with-us/validator";
import { isbnSchema,updateIsbnSchema } from "./admin/isbn/validator"
import rateLimit from "express-rate-limit";
import { SerchAuthorqueryparamsSchema } from "./admin/authors/serch/validate"


export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute (in milliseconds)
  max: 3, // Allow only 3 requests per minute
  message: "Too many requests, please try again after a minute.",
  headers: true, // Send rate limit info in response headers
});




  export const findparamsSchema = createFindParams()
  
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
        matcher: "/admin/authors/serch",
        method: "GET",  
        middlewares: [
          validateAndTransformQuery(
           SerchAuthorqueryparamsSchema,
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
        matcher: "/admin/authors/link",
        method: "POST",
        middlewares: [
          validateAndTransformBody(linkAuthor),
        ],
      },
      {
        matcher: "/admin/authors/link",
        method: "DELETE",
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
            findparamsSchema,
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
            findparamsSchema,
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
          rateLimiter
        ],
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
      {
        matcher: "/store/serch",
        method: "GET",
        middlewares: [
          validateAndTransformQuery(
           combinedParams,{

           }
          ),
        
        ],
      },
      {
        matcher: "/store/upload",
        method: "POST",
        middlewares: [
        validateAndTransformBody(uploadSchema),
        rateLimiter
        
        ],
      },
      {
        matcher: "/store/specimen",
        method: "POST",
        middlewares: [
        validateAndTransformBody(specimenRequestSchema),
        rateLimiter
        
        ],
      },
      {
        matcher: "/store/publish-with-us",
        method: "POST",
        middlewares: [
        validateAndTransformBody(publishWithUsSchema),
        rateLimiter
        
        ],
      },
      // {
      //   matcher: "/admin/publish-with-us",
      //   method: "GET",
      //   middlewares: [
      //     validateAndTransformQuery(
      //       findparamsSchema,
      //       {
      //         defaults: [
      //          '*',

      //         ],
      //         isList: true,
      //       }
      //     ),
      //   ],
      // },
      {
        matcher: "/admin/specimenRequest",
        method: "GET",
        middlewares: [
          validateAndTransformQuery(
            findparamsSchema,
            {
              defaults: [
               'email',"id","phone_number","school_name","created_at","updated_at"
              ],
              isList: true,
            }
          ),
        ],
      },
      {
        matcher: "/admin/isbn",
        method: "PUT",
        middlewares: [
          validateAndTransformBody(updateIsbnSchema),
        ],
      },
      {
        matcher: "/admin/isbn",
        method: "POST",
        middlewares: [
          validateAndTransformBody(isbnSchema),
        ],
      },
      {
        matcher: "/admin/isbn-create",
        method: "POST",
        middlewares: [
          validateAndTransformBody(isbnSchema),
        ],
      },
      {
        matcher: "/admin/isbn-create",
        method: "PUT",
        middlewares: [
          validateAndTransformBody(updateIsbnSchema),
        ],
      },
    ],
  })