import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DecisionProcess } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"
import { Table } from "../../components/table"
import { ActionMenu } from "../../components/action-menu"
import { Trash,Eye} from "@medusajs/icons"

import { ActionPrompt } from "../../components/prompt"
import { useDeleteWithPrompt } from "../../hooks/useDeleteWithPrompt"
// import { ConstraintViolationException } from "@mikro-orm/core"
import { useNavigate } from "react-router-dom"
import { BiImport } from "react-icons/bi";
import { BACKEND_URl } from "../../env"

type AuthorsResponse = {
  data: {
    id: string
    email: string
    phone_number: string
    school_name: string
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
  queryFn: () => sdk.client.fetch(`/admin/specimenRequest`, {
    query: {
      limit,
      offset,
    },
  }),
  queryKey: [["specimenRequest", limit, offset]],
})
console.log('diditeradevardiwana:',data);   




// Focus Model open state
// Delete Author
const {isDeletePromptOpen,setDeletePromptOpen,deleteData,dataToDelete,onsuccess,handleDelete} =  useDeleteWithPrompt("specimenRequest", refetch);
  return (
    <Container className="divide-y p-0">
        <ActionPrompt 
              open={isDeletePromptOpen}
              onOpenChange={setDeletePromptOpen}
              title="Delete Specimen"
              description="Are you sure you want to delete this Specimen Request? This action cannot be undone."
              mutationKey="delete-Specimen"
              mutationFn={deleteData} 
              mutationArgs={dataToDelete}
              actionLabel="Delete"
              onsuccess={onsuccess}
              queryKey={["specimenRequest", limit, offset]}
            />
      <div className="flex items-center  px-6 py-4">
        <div>
          <Heading level="h2">Specimen Requests</Heading>
        </div>
        <div className="mx-5">
            <a href={`${BACKEND_URl}/admin/specimen-download`} className="flex flex items-center justify-between"><BiImport/>download</a>
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
      key: "phone_number",
      label: "Phone Number",
    },
    {
      key: "school_name",
      label: "School Name",
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
                      navigate(`/specimen/${value}`)
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
  label: "specimen",
  icon: DecisionProcess,
})

export default SpecimenPage 