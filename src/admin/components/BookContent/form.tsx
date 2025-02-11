import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { sdk } from "../../lib/sdk";
import { Heading, Button, Label, Input, toast, Text } from "@medusajs/ui";
import { BookContentSection } from "./types";

const sectionSchema: z.ZodSchema<BookContentSection> = z.object({
  title: z.string().min(1),
  content: z.union([z.string(), z.array(z.lazy(() => sectionSchema))]),
  order: z.number(),
});

const contentSchema = z.object({
  version: z.string().optional(),
  content: z.array(sectionSchema),
  product_id: z.string(),
});

type BookContentFormProps = {
  productId: string;
};

const BookContentForm = ({ productId }: BookContentFormProps) => {
  const { data: existingContent } = useQuery({
    queryKey: ["bookContent", productId],
    queryFn: () => sdk.admin.bookContent.retrieve(productId),
  });

  const form = useForm<z.infer<typeof contentSchema>>({
    defaultValues: {
      product_id: productId,
      version: existingContent?.version || "",
      content: existingContent?.content || [],
    },
  });

  const [sections, setSections] = useState<BookContentSection[]>(
    existingContent?.content || []
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contentSchema>) => {
     console.log('data', data);
    },
    onSuccess: () => {
      toast.success("Content saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save content");
      console.error("Content save error:", error);
    },
  });

  const addSection = (parentPath: number[] = []) => {
    const newSection: BookContentSection = {
      title: "",
      content: "",
      order: Date.now(),
    };

    setSections((prevSections) => {
      // Create a deep copy of the sections array
      const updatedSections = structuredClone(prevSections);

      let currentLevel = updatedSections;
      for (let i = 0; i < parentPath.length; i++) {
        const index = parentPath[i];
        if (!Array.isArray(currentLevel[index].content)) {
          currentLevel[index].content = [];
        }
        currentLevel = currentLevel[index].content as BookContentSection[];
      }

      currentLevel.push(newSection);
      return updatedSections;
    });
  };

  const handleSubmit = form.handleSubmit((data) => {
    mutation.mutate({
      ...data,
      content: sections,
    });
  });

  return (
    <div className="p-4 border rounded-lg">
      <Heading level="h2" className="mb-6">Book Content Management</Heading>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Controller
            name="version"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Content Version</Label>
                <Input {...field} placeholder="e.g., 1.0.0" />
              </div>
            )}
          />

          <div className="space-y-4">
            <Label>Sections</Label>
            <NestedSections
              sections={sections}
              onChange={setSections}
              onAddSection={addSection}
              path={[]}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setSections(existingContent?.content || [])}
            >
              Reset Changes
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Save Content
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const NestedSections = ({ sections, onChange, onAddSection, path }: {
  sections: BookContentSection[];
  onChange: (sections: BookContentSection[]) => void;
  onAddSection: (path?: number[]) => void;
  path: number[];
}) => (
  <div className="space-y-4 ml-4 border-l pl-4">
    {sections.map((section, index) => (
      <div key={section.order} className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={section.title}
            onChange={(e) => {
              const updated = [...sections];
              updated[index].title = e.target.value;
              onChange(updated);
            }}
            placeholder="Section Title"
          />
          <Button
            variant="danger"
            size="small"
            onClick={() => {
              const updated = sections.filter((_, i) => i !== index);
              onChange(updated);
            }}
          >
            Remove
          </Button>
        </div>

        <div className="space-y-2">
          {Array.isArray(section.content) ? (
            <NestedSections
              sections={section.content}
              onChange={(subSections) => {
                const updated = [...sections];
                updated[index].content = subSections;
                onChange(updated);
              }}
              onAddSection={onAddSection}
              path={[...path, index]}
            />
          ) : (
            <textarea
              value={section.content}
              onChange={(e) => {
                const updated = [...sections];
                updated[index].content = e.target.value;
                onChange(updated);
              }}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Content details..."
            />
          )}
        </div>

        <Button
          variant="secondary"
          size="small"
          onClick={(e) => {
            e.preventDefault();
            onAddSection([...path, index]); // Correctly add subsection inside the right section
          }}
        >
          Add Subsection
        </Button>
      </div>
    ))}

    <Button
      variant="secondary"
      size="small"
      onClick={(e) => {
        e.preventDefault();
        onAddSection(path);
      }}
    >
      Add Section
    </Button>
  </div>
);

export default BookContentForm;
