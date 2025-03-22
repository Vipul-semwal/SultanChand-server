import { loadEnv, defineConfig } from '@medusajs/framework/utils';
import { Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.MEDUSA_DATABASE_URL!,
    redisUrl: process.env.REDIS_URL!,
  http: {
    storeCors: process.env.STORE_CORS!,   
    adminCors: process.env.ADMIN_CORS!,
    authCors: process.env.AUTH_CORS!,
    jwtSecret: process.env.MEDUSA_JWT_SECRET || "supersecret",
    cookieSecret: process.env.MEDUSA_COOKIE_SECRET || "supersecret",
  },
  
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              // other options...
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { 
        redisUrl: process.env.REDIS_URL,
      },
    },
    // {
    //   resolve: "@medusajs/medusa/notification",
    //   options: {
    //     providers: [
    //       {
    //         resolve: "./src/modules/resend",
    //         id: "resend",
    //         options: {
    //           channels: ["email"],
    //           api_key: process.env.RESEND_API_KEY,
    //           from: process.env.RESEND_FROM_EMAIL,
    //         },
    //       },
    //     ],
    //   },
    // },
    {
      resolve: "./src/modules/author",
    },
    {
       resolve:'./src/modules/reviews'
    },
    {
      resolve: "./src/modules/extraPdfLink",
   },
 {
  resolve: "./src/modules/content",
},
{
  resolve: "./src/modules/specimenRequest",
},
{
  resolve: "./src/modules/publishRequest",
},
{
  resolve: "./src/modules/bookIsbn",
},

  ],

})
