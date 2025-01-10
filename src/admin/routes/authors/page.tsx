import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"
import { Table } from "../../components/table"
import { ActionMenu } from "../../components/action-menu"
import { Plus,Pencil,Trash} from "@medusajs/icons"
import FocusModalWrapper from "../../components/focusModel"
import {CreateForm} from "../../components/author/create-form"

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

const AuthorPage = () => {
  // TODO retrieve brands
  const [currentPage, setCurrentPage] = useState(0)
const limit = 15
const offset = useMemo(() => {
  return currentPage * limit
}, [currentPage])

const { data } = useQuery<AuthorsResponse>({
  queryFn: () => sdk.client.fetch(`/admin/authors`, {
    query: {
      limit,
      offset,
    },
  }),
  queryKey: [["authors", limit, offset]],
})
// Focus Model open state
const [open, setOpen] = useState(false)
const foucsModelObj = {
  Child:  <CreateForm />,
   saveButtonName:"save", saveButtonOnClick:()=>{
    alert("save")
  }, open, setOpen
}

  return (
    <Container className="divide-y p-0">
      <FocusModalWrapper {...foucsModelObj}/>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Authors</Heading>
        </div>
        <div>
        <ActionMenu groups={[
        {
          actions: [
            {
              icon: <Plus />,
              label: "create",
              onClick: () => {
                foucsModelObj.Child =  <CreateForm />
                setOpen(true)
              },
            },
          ],
        },
      ]} />
      </div>
      </div>
      <Table
  columns={[
    {
      key: "id",
      label: "#",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "subText",
      label: "SubText",
    },
    {
      key: "image",
      label: "Image",
      render: (value: unknown) => {
        return (
          <img src={value as string} alt="author" className="w-10 h-10 rounded-full" />
        )
      }
    },
    {
      key: "actions",
      label: "Actions",
      render: (value:unknown) => {
        return (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <Pencil />,
                    label: "Edit",
                    onClick: () => {
                      setOpen(true)
                    },
                  },
                  {
                    icon: <Trash />,
                    label: "Delete",
                    onClick: () => {
                      alert("You clicked the edit action!")
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
  data={data?.author || []}
  pageSize={data?.limit || limit}
  count={data?.count || 0}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
/>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Authors",
  icon: TagSolid,
})

export default AuthorPage