import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { clx, Container, Heading,} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import {  z } from "zod"
import PdfForm from "../components/ProductPdf/form"
// import { useMutationData } from "../hooks/useMutation"
import { HttpTypes } from "@medusajs/framework/types"

interface ProductWithExtraLinks extends HttpTypes.StoreProduct {
  extra_link: {
    amazoneLink?: string;
    youtubeLink?: string;
    previewPdf?: string;
    questionBankPdf?: string;
    anypdf?: Record<string, string>;
    id: string
  };
}

type productType={
  product:ProductWithExtraLinks
}

// Define the type for AdminProduct with an optional author field

export const Schema = z.object({
  author_id: z.string(),
  product_id: z.string(),
})


const ProductPdfWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  // fetch the pdf data if added
  const { data:res,refetch } = useQuery({
    queryFn: () => sdk.admin.product.retrieve( product.id, {
      fields: "+extra_link.*",
    }),
    queryKey: [["link",  product.id]],
  })

  const pdfData = res as unknown as  productType

  
// console.table(pdfData?.product.extra_link)
const initialData = pdfData?.product.extra_link
    ? {
        amazoneLink: pdfData.product.extra_link.amazoneLink,
        youtubeLink: pdfData.product.extra_link.youtubeLink,
        previewPdf: pdfData.product.extra_link.previewPdf,
        questionBankPdf: pdfData.product.extra_link.questionBankPdf,
        anypdf: pdfData.product.extra_link.anypdf,
        product_id:pdfData?.product.extra_link.id
      }
    : undefined
  // to creat and add data in the form 

  return (
    <>
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Product Links and Pdfs</Heading>
        </div>
      </div>
      <Container className="divide-y p-0">
          <div className="flex items-center justify-between px-6 py-4 flex-col">
          <PdfForm
            product_id={product.id}
            initialData={initialData}
            isEditMode={Boolean(initialData)}
          />
          </div>
       </Container>
    </Container>
    </>
  )
}

// Define the widget configuration
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

// Export the component with the correct name
export default ProductPdfWidget
