import Medusa from "@medusajs/js-sdk";
// import { loadEnv } from "@medusajs/framework/utils";

// loadEnv(process.env.BASE_URL|| 'development', process.cwd())

// const baseurl:string = process.env.BASE_URL as string


export const sdk = new Medusa({
  baseUrl:"http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})