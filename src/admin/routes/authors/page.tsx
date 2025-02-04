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
import { ActionPrompt } from "../../components/prompt"
import { ConstraintViolationException } from "@mikro-orm/core"

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
  
const [currentPage, setCurrentPage] = useState(0)
const limit = 15
const offset = useMemo(() => {
  return currentPage * limit
}, [currentPage])

const { data,refetch } = useQuery<AuthorsResponse>({
  queryFn: () => sdk.client.fetch(`/admin/authors`, {
    query: {
      limit,
      offset,
    },
  }),
  queryKey: [["authors", limit, offset]],
})

const handleEdit = (authorId: string) => {
  const authorToEdit = data?.author.find((author) => author.id === authorId);
  if (!authorToEdit) return;

  setFocusModalState({
    ...focusModalState,
    Child: (
      <CreateForm
        edit={true}
        author={authorToEdit}
        CallBack={() => {
          refetch();
          focusModalState.setOpen(false);
        }}
      />
    ),
    saveButtonOnClick: () => alert("save"),
    open: true,
  });
};

// Focus Model open state

const [focusModalState, setFocusModalState] = useState({
  Child: null as React.ReactNode,
  saveButtonName: "Save",
  saveButtonOnClick: () => {},
  open: false,
  setOpen: (val: boolean) => setFocusModalState((prev) => ({ ...prev, open: val })),
});

// Delete Author
const [isDeletePromptOpen, setDeletePromptOpen] = useState(false);
const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);
const deleteAuthor = async (authorId: string) => {
  try {
   const res =  await sdk.client.fetch<Promise<{message:string}>>(`/admin/authors/${authorId}`, { method: "DELETE" });
   return {...res,status:200}
    
  } catch (error) {
    console.error(error);
    return {status:500,message:'something went wrong'}
  }
};
const onsuccess = ()=>{
  refetch();
  setDeletePromptOpen(false);
  setAuthorToDelete(null);
}
const handleDelete = (authorId: string) => {
  setAuthorToDelete(authorId); // Set the author ID to be deleted
  setDeletePromptOpen(true); // Open the delete confirmation prompt
};

  return (
    <Container className="divide-y p-0">
      <ActionPrompt 
        open={isDeletePromptOpen}
        onOpenChange={setDeletePromptOpen}
        title="Delete Author"
        description="Are you sure you want to delete this author? This action cannot be undone."
        mutationKey="delete-author"
        mutationFn={deleteAuthor} 
        mutationArgs={authorToDelete}
        actionLabel="Delete"
        onsuccess={onsuccess}
        queryKey={["authors", limit, offset]}
      />
      <FocusModalWrapper {...focusModalState}/>
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
                setFocusModalState({
                  ...focusModalState,
                  Child: <CreateForm CallBack={() => {
                    refetch();
                    focusModalState.setOpen(false);
                  }} />,
                  saveButtonOnClick: () => alert("save"),
                  open: true,
                });
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
                    icon: <Pencil />,
                    label: "Edit",
                    onClick: () => {
                      handleEdit(value as string)
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