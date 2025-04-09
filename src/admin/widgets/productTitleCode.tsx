import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {  Container, Heading,} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
// import {  z } from "zod"
// import { useMutationData } from "../hooks/useMutation"
import { HttpTypes } from "@medusajs/framework/types"
import BookTitleForm from "../components/titleCode/titleCode"


interface titleCode {
  code: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  updated_at: string;
};

interface ProductWithIsbn extends HttpTypes.StoreProduct {
    title_code: titleCode;
};

type productType={
  product:ProductWithIsbn
};



const ProductTitleCodeWidget = ({ 
    data: product
  }: DetailWidgetProps<AdminProduct>) => {
    console.log(product)
    const { data:res,refetch } = useQuery({
      queryFn: () => sdk.admin.product.retrieve( product.id, {
        fields:  "+title_code.*",
      }),
      queryKey: [["title_code",  product.id]],
    })
  
    const titleoCodeData = res as unknown as  productType
    const bookTitleCode = titleoCodeData?.product?.title_code;
    console.log('titlecode',titleoCodeData);
return (
    <Container>
      <Heading >Product TitleCode</Heading>
      <Container className="divide-y p-0">
        {bookTitleCode? < BookTitleForm productId={product.id} cb={refetch} id={bookTitleCode.id} isEditMode={true} existingContent={bookTitleCode}/>: <BookTitleForm productId={product.id} cb={refetch} />}
       </Container>
    </Container>
)
  };


  export const config = defineWidgetConfig({
    zone: "product.details.side.before",
  })
  
  // Export the component with the correct name
  export default ProductTitleCodeWidget