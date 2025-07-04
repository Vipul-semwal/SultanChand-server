import Medusa from "@medusajs/js-sdk";
// const  baseUrl = "https://admin.sultanchandandsons.com";/
const baseUrl = "http://localhost:9000"


export const sdk = new Medusa({ 
  baseUrl,
  debug: true,
  auth: { 
    type: "session",
  },
});

console.log("Current NODE_ENV:", process.env.NODE_ENV,);
console.log("Using baseUrl:", process.env.NODE_ENV === "development"
  ? "http://localhost:9000"
  : "https://admin.sultanchandandsons.com"
);
