import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"
import { Table } from "../../components/table"
import { ActionMenu } from "../../components/action-menu"
import { Trash,Eye} from "@medusajs/icons"
import { FaBookBible } from "react-icons/fa6";
// import { ConstraintViolationException } from "@mikro-orm/core"
import { useNavigate } from "react-router-dom"
import { ActionPrompt } from "../../components/prompt"
import { useDeleteWithPrompt } from "../../hooks/useDeleteWithPrompt"

type AuthorsResponse = {
  data: {
    id: string;
    author_name: string;
    contact_number: string;
    email: string;
    created_at: string
  }[]
  count: number
  limit: number
  offset: number
}

const SpecimenPage = () => {
  
const [currentPage, setCurrentPage] = useState(0)
const limit = 15
const offset = useMemo(() => {
  return currentPage * limit
}, [currentPage])
const navigate = useNavigate()

const { data,refetch } = useQuery<AuthorsResponse>({
  queryFn: () => sdk.client.fetch(`/admin/publish-with-us`, {
    query: {
      limit,
      offset,
    },
  }),
  queryKey: [["publish with us", limit, offset]],
})
console.log('diditeradevardiwana:',data);   



// Focus Model open state

const [focusModalState, setFocusModalState] = useState({
  Child: null as React.ReactNode,
  saveButtonName: "Save",
  saveButtonOnClick: () => {},
  open: false,
  setOpen: (val: boolean) => setFocusModalState((prev) => ({ ...prev, open: val })),
});

// Delete logic
const {isDeletePromptOpen,setDeletePromptOpen,deleteData,dataToDelete,onsuccess,handleDelete} =  useDeleteWithPrompt("publish-with-us", refetch);

  return (
    <Container className="divide-y p-0">
       <ActionPrompt 
              open={isDeletePromptOpen}
              onOpenChange={setDeletePromptOpen}
              title="Delete Request"
              description="Are you sure you want to delete this Publish with use request? This action cannot be undone."
              mutationKey="delete-Publishrequest"
              mutationFn={deleteData} 
              mutationArgs={dataToDelete}
              actionLabel="Delete"
              onsuccess={onsuccess}
              queryKey={["publishWithus", limit, offset]}
            />
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Specimen Requests</Heading>
        </div>
        <div>
      </div>
      </div>
      <Table
  columns={[
    {
      key: "id",
      label: "#",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "subject",
      label: "subject",
    },
    {
      key: "contact_number",    
      label: "School Name",
    },
    {
      key: "author_name",    
      label: "author_name",
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
                    icon: <Eye />,
                    label: "View",
                    onClick: () => {
                      navigate(`/publish-with-us/${value}`)
                    },
                  },
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
  data={data?.data || []}
  pageSize={data?.limit || limit}
  count={data?.count || 0}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
/>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "publish with us",
  icon: FaBookBible ,
})

export default SpecimenPage 