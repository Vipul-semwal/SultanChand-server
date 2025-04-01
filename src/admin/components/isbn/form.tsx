import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, toast, Input, Label } from "@medusajs/ui";

// ✅ Define Zod Schema (Fixed)
const contentSchema = z.object({
  number: z.string().min(1, "ISBN must be at least 5 characters"),
  product_id: z.string().optional(),
  id: z.string().optional(),
});

type BookContentFormProps = {
  productId: string;
  isEditMode?: boolean;
  id?: string;
  existingContent?: {
    number: string;
    id: string;
  };
  cb?: () => void;
};

const BookIsbnForm = ({ productId, isEditMode = false, id, existingContent, cb }: BookContentFormProps) => {
  console.log('datara:',isEditMode,id,existingContent)
  // ✅ Use react-hook-form correctly
  const form = useForm<z.infer<typeof contentSchema>>({
    defaultValues: {
      product_id: productId,
      number: existingContent?.number || "",
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
        number: existingContent.number,
      });
    }
  }, [existingContent, productId, reset]);

  // ✅ Mutation for saving/updating
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contentSchema>) => {
      const url = "/admin/isbn-create";
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
      toast.success(`ISBN ${isEditMode ? "updated" : "saved"} successfully`);
      cb?.();
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditMode ? "update" : "save"} ISBN number`);
      console.error("ISBN save error:", error);
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
      number:data.number,
      id:id
    });
   }
  });
  
  console.log('erorr',errors)
  return (
    <div className="p-4 border rounded-lg overflow-hidden pb-5">
      <Heading level="h2" className="mb-6">ISBN</Heading>

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* ISBN Input */}
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label>ISBN Number</Label>
                <Input {...field} />  
                {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
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

export default BookIsbnForm;
