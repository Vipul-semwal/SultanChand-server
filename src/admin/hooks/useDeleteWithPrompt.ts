import { useState } from "react";
import { sdk } from "../lib/sdk";

export const useDeleteWithPrompt = (
  endpoint: string,
  successCb:()=>void
) => {
  
  const [isDeletePromptOpen, setDeletePromptOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<string | null>(null);

  const deleteData = async (id: string) => {
    try {
      const res = await sdk.client.fetch<{ message: string }>(
        `/admin/${endpoint}/${id}`,
        { method: "DELETE" }
      );
      return { ...res, status: 200 };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Something went wrong" };
    }
  };

  const onsuccess = () => {
    successCb()
    setDeletePromptOpen(false);
    setDataToDelete(null);
  };

  const handleDelete = (id: string) => {
    setDataToDelete(id);
    setDeletePromptOpen(true);
  };

  return {
    isDeletePromptOpen,
    setDeletePromptOpen,
    dataToDelete,
    handleDelete,
    deleteData,
    onsuccess,
  };
};
