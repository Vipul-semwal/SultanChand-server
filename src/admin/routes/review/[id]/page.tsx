import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { useMemo, useState } from "react"
import { Table } from "../../../components/table"
import { ActionMenu } from "../../../components/action-menu"
import { Trash} from "@medusajs/icons"
import { ActionPrompt } from "../../../components/prompt"
import { useDeleteWithPrompt } from "../../../hooks/useDeleteWithPrompt"
import { useParams } from "react-router-dom";
// import { ConstraintViolationException } from "@mikro-orm/core"

export interface Review {
    comment: string;
    created_at: string;
    deleted_at: string | null;
    email: string;
    id: string;
    name: string;
    product_id: string;
    rating: number;
    updated_at: string;
  }
  
  export interface ReviewsResponse {
    data: Review[];
    count: number;
    limit: number;
    offset: number;
  }

const Review = () => {
   
    const { id } = useParams<{ id: string }>();
    const [currentPage, setCurrentPage] = useState(0)
    const limit = 15
    const offset = useMemo(() => {
      return currentPage * limit
    }, [currentPage])
    
    const { data,refetch } = useQuery<ReviewsResponse>({
      queryFn: () => sdk.client.fetch(`/admin/review`, {
        query: {
          limit,
          offset,
          productId:id
        },
      }),
      queryKey: [["review", limit, offset]],
    })
    console.log('diditeradevardiwana:',data);   
    
    
    
    // Focus Model open state
    // Delete Author
    const {isDeletePromptOpen,setDeletePromptOpen,deleteData,dataToDelete,onsuccess,handleDelete} =  useDeleteWithPrompt("review", refetch);
      return (
        <Container className="divide-y p-0">
            <ActionPrompt 
                  open={isDeletePromptOpen}
                  onOpenChange={setDeletePromptOpen}
                  title="Delete Review"
                  description="Are you sure you want to delete this Review? This action cannot be undone."
                  mutationKey="delete-review"
                  mutationFn={deleteData} 
                  mutationArgs={dataToDelete}
                  actionLabel="Delete"
                  onsuccess={onsuccess}
                  queryKey={["review", limit, offset]}
                />
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <Heading level="h2">All Reviews</Heading>
            </div>
            <div>
          </div>
          </div>
          <Table
      columns={[
        {
          key: "email",
          label: "email",
        },
        {
          key: "name",
          label: "name",
        },
        {
          key: "rating",
          label: "rating",
        },
        {
            key: "comment",
            label: "comment",
          },
        {
          key: "created_at",
          label: "Date",
          render: (value: unknown ) => {
            return (
              <p>{new Date(value as string).toLocaleString()}</p>
            )
          }
        },
        {
          key: "id",
          label: "Actions",
          render: (value:unknown) => {
            console.log('atakaatkakaka:',value)
            return (
              <ActionMenu
                groups={[
                  {
                    actions: [
                      {
                        icon: <Trash />,
                        label: "Delete",
                        onClick: () => {
                          handleDelete(value as string)
                        },
                      },
                    ],
                  },
                ]}
              />
            )
          }
        }
      ]}
      data={(data?.data || []).map((review) => ({ ...review })) as Record<string, unknown>[]}
      pageSize={data?.limit || limit}
      count={data?.count || 0}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
        </Container>
      )
    }
    
    export const config = defineRouteConfig({
      label: "review",
    })
    
    export default Review;