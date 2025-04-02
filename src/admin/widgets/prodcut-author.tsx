import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { clx, Container, Heading, Text,Select,toast,Button } from "@medusajs/ui"
import { useQuery,useQueryClient } from "@tanstack/react-query"
import { useMutation} from "@tanstack/react-query";
import { sdk } from "../lib/sdk"
import {useCustomSelect} from "../hooks/useCustomSelect"
import {  z } from "zod"
import { ImCross } from "react-icons/im";

// Define the type for AdminProduct with an optional author field
type author = { id: string; name: string }
type AdminProductAuthor = AdminProduct & {
  author?: author | { id: string; name: string }[];
};


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
 const { data: queryResult,refetch } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+author.*",
    }),
    queryKey: [["product", product.id]],
  })

  console.log('query',queryResult)

  // author to select from 
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
  function handleProductAuthor(product: AdminProductAuthor) {
    if (!product.author) {
      console.log("No author assigned.");
      return;
    }
  
    if (Array.isArray(product.author)) {
      console.log("Multiple authors:");
     return  product.author.map((author) => {
            return {name: author.name,id:author.id}
     });
    } else {
      return [{name: product.author.name,id:product.author.id}];
    }
  };
  const authorList = queryResult?.product ? handleProductAuthor(queryResult.product) : [];
  console.log('authorName',authorList);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof Schema>) => {
      console.log('ara',data)
      const response:any = await sdk.client.fetch("/admin/authors/link", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.errors) {
        throw new Error("Something went wrong");
      }
       
      return response;
    },
    onSuccess: () => {

      toast.info("Info", {
        description: "author added",
      });
      queryClient.invalidateQueries({ queryKey: ["authors-select"] });
      refetch()

    },
    onError: (error) => {
      console.error("Error creating author:", error);
      toast.error("Info", {
        description: "something went wrong",
      })
    },
  });

  // console .log('authorOptions',authorOptions)
  const {selectedValue,handleValueChange,options} = useCustomSelect(authorOptions || [{value:"null",label:"null"}],product.id,mutation.mutate)   
   
  // removing author
  const removeAuthorMutation = useMutation({
    mutationFn: async (authorId: string) => {
     const res:any = await sdk.client.fetch("/admin/authors/link", {
        method: "DELETE",
        body: { author_id: authorId, product_id: product.id },
        headers: { "Content-Type": "application/json" },
      });
      if (res.errors) {
        throw new Error("Something went wrong");
      }
      return res
    },
    onSuccess: () => {
      toast.success("Author removed")
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      refetch()
    },
    onError: () => {
      toast.error("Error removing author")
    },
  })
  
  return (
    <>
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Author</Heading>
        </div>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
       <div className="flex items-center gap-2 py-">
          {(authorList ?? []).length > 0 ? (
            (authorList ?? []).map((author:author) => (
              <div key={author.id} className="flex items-center justify-between py-1 ">
                <Text size="small" weight="plus">{author.name}</Text>
               <div className="ml-2">
                <Button onClick={()=>{
                  removeAuthorMutation.mutate(author.id)
                }} disabled={removeAuthorMutation.isPending}> <ImCross/></Button>
              
               </div>
              </div>
            ))
          ) : (
            <Text size="small">No author assigned.</Text>
          )}
        </div>
      </div>
    </Container>
    <Container className="divide-y p-0">
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
      
    
    </Container>

    </>
  )
}

// Define the widget configuration
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

// Export the component with the correct name
export default ProductAuthorWidget
