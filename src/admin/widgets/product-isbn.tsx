import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {  Container, Heading,} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
// import {  z } from "zod"
// import { useMutationData } from "../hooks/useMutation"
import { HttpTypes } from "@medusajs/framework/types"
import BookIsbnForm from "../components/isbn/form"


interface Isbn {
  number: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  updated_at: string;
}

interface ProductWithIsbn extends HttpTypes.StoreProduct {
isbn: Isbn;
}

type productType={
  product:ProductWithIsbn
}



const ProductIsbnWidget = ({ 
    data: product
  }: DetailWidgetProps<AdminProduct>) => {
    console.log(product)
    const { data:res,refetch } = useQuery({
      queryFn: () => sdk.admin.product.retrieve( product.id, {
        fields: "+isbn.*",
      }),
      queryKey: [["book_isbn",  product.id]],
    })
  
    const isbnData = res as unknown as  productType
    // importent!!! this is a bug not truly but it is, somtiems it's a array of objects may be got created multipl times somehwere while testing qucick fix is just fetch  fist index values
   const bookIsbn = (() => {
  const isbn = isbnData?.product?.isbn;
  if (!isbn) return undefined; // undefined is fine
  return Array.isArray(isbn) ? isbn[0] : isbn;
})();

    console.log('we found bookisbn  ',bookIsbn);
return (
    <Container>
      <Heading >Product isbn</Heading>
      <Container className="divide-y p-0">
        {bookIsbn? <BookIsbnForm productId={product.id} cb={refetch} id={bookIsbn.id} isEditMode={true} existingContent={bookIsbn}/>: <BookIsbnForm productId={product.id} cb={refetch} />}
       </Container>
    </Container>
)
  };  


  export const config = defineWidgetConfig({
    zone: "product.details.side.before",
  })
  
  // Export the component with the correct name
  export default ProductIsbnWidget