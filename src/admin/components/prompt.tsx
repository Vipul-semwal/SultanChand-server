import {  Prompt } from "@medusajs/ui";
import { useMutationData } from "../hooks/useMutation";

interface ActionPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  mutationKey: string;
  mutationFn: any; // The mutation function, e.g., delete or add function
  mutationArgs: any; // The dynamic arguments to pass to the mutation function
  queryKey?: string | (string | number)[];
  successMessage?: string;
  errorMessage?: string;
  actionLabel: string; // Label for the action button (e.g., "Delete", "Save")
  onsuccess:()=>void
}

export function ActionPrompt({
  open,
  onOpenChange,
  title,
  description,
  mutationKey,
  mutationFn,
  mutationArgs,
  queryKey,
  actionLabel,
}: ActionPromptProps) {
  const { mutate, isPending } = useMutationData([mutationKey], mutationFn, queryKey);

  const handleAction = () => {
    mutate(mutationArgs); // Pass dynamic arguments to the mutation function
  };

  return (
    <Prompt open={open} onOpenChange={onOpenChange}>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>{title}</Prompt.Title>
          <Prompt.Description>{description}</Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel onClick={() => onOpenChange(false)}>Cancel</Prompt.Cancel>
          <Prompt.Action onClick={handleAction} disabled={isPending}>
            {isPending ? "Processing..." : actionLabel}
          </Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  );
}
