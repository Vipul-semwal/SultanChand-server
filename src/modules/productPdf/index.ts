import { Module } from "@medusajs/framework/utils"
import ProductPdfService from "./service"

export const Pdf_MODULE = "PdfProduct"
export default Module(Pdf_MODULE, {
    service: ProductPdfService,
    });
