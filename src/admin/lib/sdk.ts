import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: process.env.NODE_ENV === "development"
    ? "https://admin.sultanchandandsons.com"
    : "https://admin.sultanchandandsons.com",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
});

console.log("Current NODE_ENV:", process.env.NODE_ENV,);
console.log("Using baseUrl:", process.env.NODE_ENV === "development"
  ? "http://localhost:9000"
  : "https://admin.sultanchandandsons.com"
);
