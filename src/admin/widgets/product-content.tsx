import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {  Container, Heading,} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
// import {  z } from "zod"
// import { useMutationData } from "../hooks/useMutation"
import { HttpTypes } from "@medusajs/framework/types"
import BookContentForm from "../components/BookContent/form"

interface Content {
  title: string;
  content: string | Content[];
  order: number;
}

interface ProductWithBookContent extends HttpTypes.StoreProduct {
  bookContent: Content[];
}

type productType={
  product:ProductWithBookContent
}



const ProductContentWidget = ({ 
    data: product
  }: DetailWidgetProps<AdminProduct>) => {
    console.log(product)
    const { data:res,refetch } = useQuery({
      queryFn: () => sdk.admin.product.retrieve( product.id, {
        fields: "+content*",
      }),
      queryKey: [["book content",  product.id]],
    })
  
    const ContentData = res as unknown as  productType
    console.log('wakwakwak',ContentData);
return (
    <Container>
      <Heading >Product Content</Heading>
      <Container className="divide-y p-0">
          <div className="flex items-center justify-between px-6 py-4 flex-col">
         <BookContentForm productId={product.id}/>
          </div>
       </Container>
    </Container>
)
  };


  export const config = defineWidgetConfig({
    zone: "product.details.before",
  })
  
  // Export the component with the correct name
  export default ProductContentWidget