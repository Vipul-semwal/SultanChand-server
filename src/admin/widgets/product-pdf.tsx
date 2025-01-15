import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { clx, Container, Heading, Text,Select,toast } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useMutation} from "@tanstack/react-query";
import { sdk } from "../lib/sdk"
import {useCustomSelect} from "../hooks/useCustomSelect"
import {  z } from "zod"
import PdfForm from "../components/ProductPdf/form"


// Define the type for AdminProduct with an optional author field
type AdminProductAuthor = AdminProduct & {
  author?: {
    id: string
    name: string
  }
}

type AuthorsResponse = {
  author: {
    id: string
    name: string
    description: string
    image: string
    subText: string
  }[]
  count: number
  limit: number
  offset: number
}

export const Schema = z.object({
  author_id: z.string(),
  product_id: z.string(),
})


const ProductAuthorWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+PdfProduct.*",
    }),
    queryKey: [["product", product.id]],
  })

  console.log('prodcut',product)

//   edit pdf and links to files
  const { data,isLoading:loading,isError } = useQuery<AuthorsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/authors`, {
      query: {
        limit:1000
      },
    }),
    queryKey: [["authors-select"]],
  })
  const authorOptions = data?.author?.map((item: {
    id: string
    name: string
    description: string
    image: string
    subText: string
  })=>{
    return {value: item.id,
      label: item.name}
  });
  // Safely extract the author's name
  const authorName = (queryResult?.product as AdminProductAuthor)?.author?.name
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof Schema>) => {
      console.log('ara',data)
      const response = await sdk.client.fetch("/admin/authors/link", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    onSuccess: () => {

      toast.info("Info", {
        description: "author added",
      })

    },
    onError: (error) => {
      console.error("Error creating author:", error);
      toast.error("Info", {
        description: "something went wrong",
      })
    },
  });

  console .log('authorOptions',authorOptions)
  const {selectedValue,handleValueChange,options} = useCustomSelect(authorOptions || [{value:"null",label:"null"}],product.id,mutation.mutate)   
   
  
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
          <PdfForm/>
          </div>
       </Container>
      {/* <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Name
        </Text>

        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {authorName || "-"}
        </Text>
      </div> */}
    </Container>
    {/* <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Select Author</Heading>
        </div>
        <div className="w-[256px]">
      <Select 
        onValueChange={handleValueChange} 
        value={selectedValue}
        disabled={mutation.isPending}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select an author" />
        </Select.Trigger>
        <Select.Content>
          {options.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      {mutation.isPending && <span>Loading...</span>}
    </div>
      </div>
      
    
    </Container> */}

    </>
  )
}

// Define the widget configuration
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

// Export the component with the correct name
export default ProductAuthorWidget
