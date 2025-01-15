import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, Label, Input, toast, Textarea } from "@medusajs/ui";

const schema = z.object({
  amazoneLink: z.string().url().optional(),
  youtubeLink: z.string().url().optional(),
  previewPdf: z.string().url().optional(),
  questionBankPdf: z.string().url().optional(),
  anypdf: z.record(z.string().url()).optional(),
});

export const PdfForm = () => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      amazoneLink: "",
      youtubeLink: "",
      previewPdf: "",
      questionBankPdf: "",
      anypdf: {},
    },
  });

  const [extraPdfs, setExtraPdfs] = useState<{ label: string; file: File | null; url: string | null }[]>([]);
  
  const uploadFile = async (file: File) => {
    try {
      const response = await sdk.admin.upload.create({ files: [file] });
      return response.files[0].url; // Returns the uploaded file's URL
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const response = await sdk.client.fetch("/admin/pdfs", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    onSuccess: () => {
      form.reset();
      setExtraPdfs([]);
      toast.info("Info", {
        description: "PDF data saved successfully!",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to save PDF data.",
      });
    },
  });

  const handleExtraPdfChange = (index: number, label: string, file: File | null) => {
    const updatedExtraPdfs = [...extraPdfs];
    updatedExtraPdfs[index] = { ...updatedExtraPdfs[index], label, file, url: null };
    setExtraPdfs(updatedExtraPdfs);
  };

  const handleExtraPdfUpload = async () => {
    const pdfsToUpload = extraPdfs.map(async (pdf) => {
      if (pdf.file) {
        const url = await uploadFile(pdf.file);
        return { label: pdf.label, url };
      }
      return null;
    });

    const uploadedPdfs = await Promise.all(pdfsToUpload);
    const pdfRecord = uploadedPdfs.reduce((acc, pdf) => {
      if (pdf) acc[pdf.label] = pdf.url!;
      return acc;
    }, {} as Record<string, string>);
    return pdfRecord;
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      // Upload extra PDFs
      const anyPdf = await handleExtraPdfUpload();

      // Submit form with `anypdf` data
      mutation.mutate({ ...values, anypdf: anyPdf });
    } catch (error) {
      console.error("Error saving PDF data:", error);
    }
  });

  return (
    <>
      <Heading className="mb-4">Create PDF Records</Heading>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amazone Link */}
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
              Preview PDF
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
              Question Bank PDF
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
                <Input
                  placeholder="Label"
                  value={pdf.label}
                  onChange={(e) =>
                    handleExtraPdfChange(index, e.target.value, pdf.file)
                  }
                />
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handleExtraPdfChange(index, pdf.label, e.target.files?.[0] || null)
                  }
                />
              </div>
            ))}
            <Button
              size="small"
              variant="secondary"
              onClick={() =>
                setExtraPdfs([...extraPdfs, { label: "", file: null, url: null }])
              }
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
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="small" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default PdfForm;
