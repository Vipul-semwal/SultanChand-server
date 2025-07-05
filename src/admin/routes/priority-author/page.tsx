import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid } from "@medusajs/icons"
import { Container, Heading, Input} from "@medusajs/ui"
import { Query, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"
import { Table } from "../../components/table"
import { ActionMenu } from "../../components/action-menu"
import { Pencil,Trash} from "@medusajs/icons"
import FocusModalWrapper from "../../components/focusModel"
import { ActionPrompt } from "../../components/prompt"
// import { ConstraintViolationException } from "@mikro-orm/core"
import { MdLowPriority } from "react-icons/md";
import { toast } from "@medusajs/ui"
import {
  Select,
} from "@medusajs/ui";
import PrioritySelect from "./prioritySelect"



type AuthorPriorityItem = {
  data:{
    id: string;
  image: string;
  name: string;
  priority: number;
  }[]
};

const AuthorPage = () => {
  
const [currentPage, setCurrentPage] = useState(0);
const limit = 15
const offset = useMemo(() => {
  return currentPage * limit
}, [currentPage])
const { data, refetch } = useQuery<AuthorPriorityItem>({
  queryFn: () => {
    const url = "/admin/priority-author"

    return sdk.client.fetch(url, {
      method: "GET",
    })
  },
  queryKey:["priority-author"]
})


// Focus Model open state

const [focusModalState, setFocusModalState] = useState({
  Child: null as React.ReactNode,
  saveButtonName: "Save",
  saveButtonOnClick: () => {},
  open: false,
  setOpen: (val: boolean) => setFocusModalState((prev) => ({ ...prev, open: val })),
});

const [isDeletePromptOpen, setDeletePromptOpen] = useState(false);
const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);
const deleteAuthor = async (authorId: string) => {
  try {
   const res =  await sdk.client.fetch<Promise<{message:string}>>(`/admin/priority-author/${authorId}`, { method: "DELETE" });
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
        title="remove Author"
        description="Are you sure you want to remove this author?"
        mutationKey="remove-author"
        mutationFn={deleteAuthor} 
        mutationArgs={authorToDelete}
        actionLabel="Delete"
        onsuccess={onsuccess}
        queryKey={["authors", limit, offset]}
      />
      <FocusModalWrapper {...focusModalState}/>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Priority</Heading>
        </div>
        <div>
      </div>
      </div>
      <Table
  columns={[
    // {
    //   key: "id",
    //   label: "#",
    // },
     {
      key: "priority",
      label: "priority",
        render: (value: unknown) => {
        return (
         <p>{value as string}</p>
        )
      }
    },
    {
      key: "name",
      label: "Name",
    },
    // {
    //   key: "description",
    //   label: "Description",
    // },
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
                    //   handleEdit(value as string)
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
    },
     {
      key: "id",
      label: "Change priority",
     render: (value: unknown,) => {
    return (
      <PrioritySelect
      num={data?.data.length || 0}
    authorId={value as string}
    currentPriority={0}
    refetch={refetch}
  />
    )
  },
    }
  ]}
  data={data? data.data : []}
  pageSize={ limit}
  count={ 0}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
/>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Priority",
  icon: MdLowPriority,
})

export default AuthorPage