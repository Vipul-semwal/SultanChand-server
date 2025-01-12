import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, Label, Input,toast,Textarea } from "@medusajs/ui";

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  subText: z.string().optional(),
});

export const CreateForm = () => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      subText: "",
    },
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  type BaseUploadFile = {
    files: ({
        name: string;
        content: string;
    } | File)[];
} | FileList;

  const queryClient = useQueryClient();

  // Mutation to create author
  // work in progress - need to impliment inavlidateQueries and edit and delete route
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const response = await sdk.client.fetch("/admin/authors", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors","authors-select"] });
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      toast.info("Info", {
        description: "author added",
      })

    },
    onError: (error) => {
      console.error("Error creating author:", error);
      toast.error("Info", {
        description: "something went wrong",
      })
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadFile = async (files:BaseUploadFile) => {
    try {
      const response = await sdk.admin.upload.create(files);
    //   console.log(uploads[0].url); // URL of the uploaded file
      return response.files[0].url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      let imageUrl:string = "";
      if (selectedImage) {
        imageUrl = await uploadFile({files:[selectedImage]});
      }
      mutation.mutate({ ...values, image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  });

  return (
    <>
      <Heading className="mb-4">Create Author</Heading>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6 h-ful">
          <div className="flex flex-col gap-y-6">
            {/* Name Field */}
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <Label size="small" weight="plus">
                    Name
                  </Label>
                  <Input {...field} />
                </div>
              )}
            />

            {/* Description Field */}
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <Label size="small" weight="plus">
                    Description
                  </Label>
                  <Textarea {...field} className="resize-both" />
                </div>
              )}
            />

            {/* Image Upload Field */}
            <div className="flex flex-col space-y-2">
              <Label size="small" weight="plus">
                Upload Image
              </Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Selected" className="h-40 w-40 object-cover" />
                </div>
              )}
            </div>

            {/* SubText Field */}
            <Controller
              control={form.control}
              name="subText"
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <Label size="small" weight="plus">
                    Sub Text
                  </Label>
                  <Input {...field} />
                </div>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-x-2">
            <Button
              size="small"
              variant="secondary"
              type="button"
              onClick={() => {
                form.reset();
                setSelectedImage(null);
                setImagePreview(null);
              }}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="small"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateForm;
