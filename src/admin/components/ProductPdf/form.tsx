"use client"

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, Label, Input, toast } from "@medusajs/ui";
import { MdAltRoute, MdDelete } from "react-icons/md";

const schema = z.object({
  amazoneLink: z.string().url().optional(),
  youtubeLink: z.string().url().optional(),
  previewPdf: z.string().url().optional(),
  questionBankPdf: z.string().url().optional(),
  anypdf: z.record(z.string().url()).optional(),
  product_id:z.string()
});

type PdfFormProps = {
  product_id: string;
  initialData?: z.infer<typeof schema>; // Pre-filled data for update
  isEditMode?: boolean; // Indicates if the form is in edit mode
  cb?:()=>void
};

const PdfForm = ({ product_id, initialData, isEditMode = false,cb }: PdfFormProps) => {
  console.log('diljalne kibaat karte hoon@')
  console.log('form', initialData, isEditMode, product_id);

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: initialData ? { ...initialData} : {
      amazoneLink: "",
      youtubeLink: "",
      previewPdf: "",
      questionBankPdf: "",
      anypdf: {},
      product_id: product_id
    },
  });

  useEffect(() => {
    if (initialData) {
      const turend =  Object.entries(initialData?.anypdf || {}).map(([label, url]) => ({
        label,
        file: null,
        url,
      }));
    setExtraPdfs(turend);
      form.reset(initialData);
    }
  }, [initialData]);

  const [extraPdfs, setExtraPdfs] = useState<{ label: string; file: File | null; url: string | null }[]>(
    Object.entries(initialData?.anypdf || {}).map(([label, url]) => ({
      label,
      file: null,
      url,
    }))
  );
  const removeItem = (index: number) => {
    setExtraPdfs((prev) => prev.filter((_, i) => i !== index));
  };
  
  const uploadFile = async (file: File) => {
    try {
      const response = await sdk.admin.upload.create({ files: [file] });
      console.log("File uploaded successfully:", response);
      return response.files[0].url; // Returns the uploaded file's URL
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const url = isEditMode ? `/admin/extralinks` : "/admin/extralinks";
      const method = isEditMode ? "PUT" : "POST";
     
      console.log('Data to be sent:', data);  
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
    onSuccess: (data) => {
      console.log("Response from backend:", data);
      form.reset();
      toast.info("Info", {
        description: isEditMode ? "PDF data updated successfully!" : "PDF data saved successfully!",
      });
      if(cb){
        cb()
      }
    },
    onError: () => {
      toast.error("Error", {
        description: isEditMode ? "Failed to update PDF data." : "Failed to save PDF data.",
      });
    },
  });

  const handleExtraPdfChange = (index: number, label: string, file: File | null) => {
    const updatedExtraPdfs = [...extraPdfs];
    updatedExtraPdfs[index] = { ...updatedExtraPdfs[index], label, file, url: null };
    setExtraPdfs(updatedExtraPdfs);
  };

  const handleExtraPdfUpload = async () => {
    const uploadTasks = extraPdfs.map(async (pdf) => {
      try {
        const url = pdf.file ? await uploadFile(pdf.file) : pdf.url;
        return url ? { label: pdf.label, url } : null;
      } catch (error) {
        console.error(`Failed to upload ${pdf.label}`, error);
        return null;
      }
    });
  
    const uploadedPdfs = (await Promise.all(uploadTasks)).filter(Boolean);
    
    return Object.fromEntries(uploadedPdfs.filter((pdf): pdf is { label: string; url: string } => pdf !== null).map(({ label, url }) => [label, url]));
  };
  

  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("Form values:",{...values, anypdf: extraPdfs,});

    try {
      const anyPdf = await handleExtraPdfUpload();
      console.log("Uploaded PDFs:", {...values, anypdf: anyPdf,});

      mutation.mutate({ ...values, anypdf: anyPdf,});
    } catch (error) {
      console.error("Error saving PDF data:", error);
    }
  });

  return (
    <>
      <Heading className="mb-4">{isEditMode ? "Update PDF Records" : "Create PDF Records"}</Heading>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amazon Link */}
          <Controller
            control={form.control}
            name="amazoneLink"
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label size="small" weight="plus">
                  Amazon Link
                </Label>
                <Input {...field} />
              </div>
            )}
          />

          {/* YouTube Link */}
          <Controller
            control={form.control}
            name="youtubeLink"
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Label size="small" weight="plus">
                  YouTube Link
                </Label>
                <Input {...field} />
              </div>
            )}
          />

          {/* Preview PDF */}
          <div className="flex flex-col space-y-2">
            <Label size="small" weight="plus">
              {form.getValues("previewPdf") ? (<a
                href={form.getValues("previewPdf") || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Current Preview PDF
              </a>) : " Preview PDF"}
            </Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadFile(file);
                  form.setValue("previewPdf", url);
                }
              }}
            />
          </div>

          {/* Question Bank PDF */}
          <div className="flex flex-col space-y-2">
            <Label size="small" weight="plus">
              {form.getValues("questionBankPdf") ? (<a
                href={form.getValues("questionBankPdf") || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Current Question Bank PDF
              </a>) : "Question Bank PDF"}
            </Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadFile(file);
                  form.setValue("questionBankPdf", url);
                }
              }}
            />
          </div>

          {/* Extra PDFs */}
          <div className="flex flex-col space-y-2">
            <Label size="small" weight="plus">
              Extra PDFs
            </Label>
            {extraPdfs.map((pdf, index) => (
              <div key={index} className="flex items-center gap-2">
                {/* Input for Label */}
                <Input
                  placeholder="Label"
                  value={pdf.label}
                  onChange={(e) =>
                    handleExtraPdfChange(index, e.target.value, pdf.file)
                  }
                />

                {/* File Upload and URL */}
                <div className="flex flex-col">
                  {/* View PDF Link */}
                  {pdf.url && !pdf.file && (
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  )}

                  {/* File Input */}
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      handleExtraPdfChange(index, pdf.label, e.target.files?.[0] || null)
                    }
                  />
                </div>
               <div className="dlt mt-5">
               <MdDelete fontSize={"20px"} className="cursor-pointer" onClick={()=>{
                  removeItem(index)
               }} color="red"/>  
               </div>
              </div>
            ))}
            <Button
              size="small"
              variant="secondary"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setExtraPdfs([...extraPdfs, { label: "", file: null, url: null }]);
              }}
            >
              Add Extra PDF
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-x-2">
            <Button
              size="small"
              variant="secondary"
              type="button"
              onClick={() => {
                form.reset();
                setExtraPdfs([]);
                setExtraPdfs(Object.entries(initialData?.anypdf || {}).map(([label, url]) => ({
                  label,
                  file: null,
                  url,
                })))
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="small" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default PdfForm;




