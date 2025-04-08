import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { clx, Container, Heading, Text,Select,toast,Button } from "@medusajs/ui"
import { useQuery,useQueryClient } from "@tanstack/react-query"
import { useMutation} from "@tanstack/react-query";
import { sdk } from "../lib/sdk"
import {useCustomSelect} from "../hooks/useCustomSelect"
import {  z } from "zod"
import { ImCross } from "react-icons/im";
import {useState,useEffect} from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Input } from "@medusajs/ui";

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

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

 const { data: queryResult,refetch } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+author.*",
    }),
    queryKey: [["product", product.id]],
  })

  console.log('query',queryResult)

  // author to select from 
  // const { data,isLoading:loading,isError } = useQuery<AuthorsResponse>({
  //   queryFn: () => sdk.client.fetch(`/admin/authors`, {
  //     query: {
  //       limit:1000
  //     },
  //   }),
  //   queryKey: [["authors-select"]],
  // });

  const { data } = useQuery<AuthorsResponse>({
    queryFn: () => {
      const url = debouncedSearch
        ? `/admin/authors/serch`
        : `/admin/authors`
      const query = debouncedSearch
        ? { query: debouncedSearch }
        : { limit:30 }
  
      return sdk.client.fetch(url, {
        method: "GET",
        query,
      })
    },
    queryKey: debouncedSearch
      ? [["authors-search-select", debouncedSearch]]
      : [["author-select" ]],
  })
  
  
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('sechtiem"',searchTerm)
      setDebouncedSearch(searchTerm)
      // refetch()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])
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
  });


  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchTerm("");
      setDebouncedSearch("");
    }
  };
  
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
    <Container className="divide-y p-0 mt-4">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Select Author</Heading>
          <div className="w-[320px] relative">
            <Select
              open={isSearchOpen}
              onOpenChange={setIsSearchOpen}
              onValueChange={handleValueChange}
              value={selectedValue}
              disabled={mutation.isPending}
            >
              <Select.Trigger>
                <div className="flex items-center gap-2 w-full">
                  <FiSearch className="text-ui-fg-muted" />
                  <Select.Value placeholder="Search or select author..." />
                </div>
              </Select.Trigger>
              
              <Select.Content className="w-[320px]" side="bottom" align="end">
                <div className="p-2 space-y-2">
                  <div className="relative">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search authors..."
                      className="pr-8"
                    />
                    {searchTerm && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setSearchTerm("")}
                      >
                        <FiX className="text-ui-fg-muted hover:text-ui-fg-base" />
                      </button>
                    )}
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {(authorOptions ?? []).length === 0 ? (
                      <div className="p-2 text-center text-ui-fg-muted">
                        {data ? "No matches found" : "Loading..."}
                      </div>
                    ) : (
                      (authorOptions ?? []).map((item) => (
                        <Select.Item 
                          key={item.value} 
                          value={item.value}
                          className="hover:bg-ui-bg-base-hover"
                        >
                          {item.label}
                        </Select.Item>
                      ))
                    )}
                  </div>
                </div>
              </Select.Content>
            </Select>

            {mutation.isPending && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <span className="text-ui-fg-muted">Loading...</span>
              </div>
            )}
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
