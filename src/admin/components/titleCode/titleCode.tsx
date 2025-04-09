import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, toast, Input, Label } from "@medusajs/ui";

// ✅ Define Zod Schema (Fixed)
const contentSchema = z.object({
  code: z.string().min(1, "title must be at least 1 characters"),
  product_id: z.string().optional(),
  id: z.string().optional(),
});

type BookContentFormProps = {
  productId: string;
  isEditMode?: boolean;
  id?: string;
  existingContent?: {
    code: string;
    id: string;
  };
  cb?: () => void;
};

const BookTitleForm = ({ productId, isEditMode = false, id, existingContent, cb }: BookContentFormProps) => {
  console.log('datara:',isEditMode,id,existingContent)
  // ✅ Use react-hook-form correctly
  const form = useForm<z.infer<typeof contentSchema>>({
    defaultValues: {
      product_id: productId,
      code: existingContent?.code || "",
    },
  });

  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = form;

  // ✅ Ensure form is reset when `existingContent` changes
  useEffect(() => {
    if (existingContent) {
      reset({
        product_id: productId,
        code: existingContent.code,
      });
    }
  }, [existingContent, productId, reset]);

  // ✅ Mutation for saving/updating
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contentSchema>) => {
      const url = "/admin/title-code";
      const method = isEditMode ? "PUT" : "POST";

      const response: any = await sdk.client.fetch(url, {
        method,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.errors) {
        console.log('this is the erro :',response.errors)
        throw new Error("Something went wrong");
      }
      return response;
    },
    onSuccess: () => {
      toast.success(`Title Code ${isEditMode ? "updated" : "saved"} successfully`);
      cb?.();
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditMode ? "update" : "save"} Title code`);
      console.error("title code save error:", error);
    },
  });

  // ✅ Submit Handler
  const onSubmit = handleSubmit((data) => {
    console.log('hellosirf',data)
   if(!isEditMode){
    mutation.mutate({
      ...data,
      ...(isEditMode && id ? { id } : {}),
    });
   }
   else{
    mutation.mutate({
      code:data.code,
      id:id
    });
   }
  });
  
  console.log('erorr',errors)
  return (
    <div className="p-4 border rounded-lg overflow-hidden pb-5">
      <Heading level="h2" className="mb-6">Title Code</Heading>

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* ISBN Input */}
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label>Title Code</Label>
                <Input {...field} />  
                {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
              </div>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" size="small" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : isEditMode ? "Update" : "Save"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default BookTitleForm ;
