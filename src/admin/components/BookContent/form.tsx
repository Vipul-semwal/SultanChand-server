import { useState,useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, toast } from "@medusajs/ui";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const contentSchema = z.object({
  content: z.string(), // Simplified to single string
  product_id: z.string(),
  id: z.string().optional(),
});

type BookContentFormProps = {
  productId: string;
  isEditMode?: boolean;
  id?: string;
  existingContent?:{
    content: string, 
  id: string
  },
  cb?:()=>void
};

const BookContentForm = ({ productId, isEditMode = false, id,existingContent,cb }: BookContentFormProps) => {
  console.log('jajasj',existingContent,id,isEditMode)

  const form = useForm<z.infer<typeof contentSchema>>({
    defaultValues: {
      product_id: productId,
      content: existingContent?.content || "", // Now expects string
    },
  });

  const [content, setContent] = useState<string>(existingContent?.content || "");
  useEffect(()=>{
 if (existingContent) {
  setContent(existingContent?.content)
 }
  },[existingContent])

  console.log('snaaalp',content)

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contentSchema>) => {
      const url = isEditMode ? `/admin/book-content` : "/admin/book-content";
      const method = isEditMode ? "PUT" : "POST";
      console.log('hiyuuu',data)
      
      const response: any = await sdk.client.fetch(url, {
        method,
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
      toast.success(`Content ${isEditMode ? `updated` : "saved"} successfully`);
      if(cb){
        cb()
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditMode ? `update` : "save"} content`);
      console.error("Content save error:", error);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if(!content){
      toast.info('please fil it')
    }
    mutation.mutate({
      ...data,
      content: content,
      ...(isEditMode && id && { id })
    });
  });

  return (
    <div className="p-4 border rounded-lg overflow-hidden pb-5 ">
    <Heading level="h2" className="mb-6">Book Content</Heading>
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end mt-5">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setContent(existingContent?.content || "")}
            className="w-full md:w-auto" // Full width on mobile, auto on desktop
            size="small" // Force small size on mobile
          >
            Reset Changes
          </Button>
          <Button 
            type="submit" 
            isLoading={mutation.isPending}
            className="w-full md:w-auto" // Full width on mobile, auto on desktop
            size="small" // Force small size on mobile
          >
            Save Content
          </Button>
        </div>
        <div className="mb-5">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(data)=>{
              setContent(data)
            }}
            className="h-56 mb-8"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
      </form>
    </FormProvider>
  </div>
  );
};

export default BookContentForm;