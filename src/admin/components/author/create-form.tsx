import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // ✅ Import resolver
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, Label, Input, toast, Textarea } from "@medusajs/ui";

const schema = z.object({
  id:z.string().optional(),
  name: z.string().min(1, "Name is required"), // ✅ Show error if empty
  description: z.string().min(1, "Description is required"),
  image: z.string().nullable(),
  subText: z.string().min(1, "Sub Text is required"),
});

interface Author {
  id: string;
  name: string;
  description: string;
  image: string;
  subText: string;
}

interface CreateFormProps {
  edit?: boolean;
  author?: Author;
  CallBack?: (updatedAuthor?: Author) => void;
}

export const CreateForm: React.FC<CreateFormProps> = ({ edit = false, author, CallBack }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema), // ✅ Use Zod validation
    defaultValues: {
      name: author?.name || "",
      description: author?.description || "",
      image: author?.image || "",
      subText: author?.subText || "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors }, // ✅ Get errors
  } = form;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(author?.image || null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const url = edit ? `/admin/authors` : "/admin/authors";
      const method = edit ? "PUT" : "POST";
      
      return sdk.client.fetch(url, {
        method,
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors", "authors-select"] });
      toast.info("Success", { description: edit ? "Author updated" : "Author added" });
      if (CallBack) CallBack();
    },
    onError: () => {
      toast.error("Error", { description: "Something went wrong" });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(author?.image || null);
    }
  };

  const uploadFile = async (file: File) => {
    const response = await sdk.admin.upload.create({ files: [file] });
    return response.files[0].url;
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      let imageUrl = author?.image || "";
      if (selectedImage) imageUrl = await uploadFile(selectedImage);
      if(edit){
        mutation.mutate({ ...values, image: imageUrl,id:author?.id });
      }
    else{
      mutation.mutate({ ...values, image: imageUrl });
    }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  });

  return (
    <>
      <Heading className="mb-4">{edit ? "Edit Author" : "Create Author"}</Heading>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label>Name</Label>
                <Input {...field} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>} {/* ✅ Show error */}
              </div>
            )}
          />

          {/* Description Field */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label>Description</Label>
                <Textarea {...field} className="resize-both" />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>} {/* ✅ Show error */}
              </div>
            )}
          />

          {/* Image Upload */}
          <div className="flex flex-col space-y-2">
            <Label>Upload Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Selected" className="h-40 w-40 object-cover" />}
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>} {/* ✅ Show error */}
          </div>

          {/* Sub Text Field */}
          <Controller
            name="subText"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label>Sub Text</Label>
                <Input {...field} />
                {errors.subText && <p className="text-red-500 text-sm">{errors.subText.message}</p>} {/* ✅ Show error */}
              </div>
            )}
          />

          {/* Buttons */}
          <div className="flex items-center justify-end gap-x-2">
            <Button
              size="small"
              variant="secondary"
              type="button"
              onClick={() => {
                form.reset();
                setSelectedImage(null);
                setImagePreview(author?.image || null);
              }}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="small" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : edit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateForm;
