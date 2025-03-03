import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {  Container, Heading,} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
// import {  z } from "zod"
// import { useMutationData } from "../hooks/useMutation"
import { HttpTypes } from "@medusajs/framework/types"
import BookContentForm from "../components/BookContent/form"
import BookContent from "../components/BookContent/content"


interface Content {
  content: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  product_id: string;
  updated_at: string;
}

interface ProductWithBookContent extends HttpTypes.StoreProduct {
book_content: Content;
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
        fields: "+book_content.*",
      }),
      queryKey: [["book content",  product.id]],
    })
  
    const ContentData = res as unknown as  productType
    const bookContent = ContentData?.product?.book_content;
    console.log('wakwakwak',bookContent);
return (
    <Container>
      <Heading >Product Content</Heading>
      <Container className="divide-y p-0">
          <div className="flex items-center justify-between px-6 py-4 flex-col">
          {/* <BookContentForm productId={product.id} isEditMode={true} id={bookContent.id} existingContent={bookContent} cb={refetch}/> */}
           {bookContent?<BookContentForm productId={product.id} isEditMode={true} id={bookContent.id} existingContent={bookContent} cb={refetch}  />:<BookContentForm  productId={product.id}  cb={refetch}/>}
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