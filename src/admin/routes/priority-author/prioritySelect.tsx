import { useState } from "react";
import { toast,Select } from "@medusajs/ui"

import { sdk } from "../../lib/sdk";

type Props = {
  authorId: string;
  currentPriority: number;
  refetch: () => void;
  num:number
};

const PrioritySelect = ({ authorId, currentPriority, refetch,num }: Props) => {
  const [selectedPriority, setSelectedPriority] = useState<string>(
    currentPriority.toString()
  );
  const [isPending, setIsPending] = useState(false);

  const handleValueChange = async (newValue: string) => {
    setSelectedPriority(newValue);
    setIsPending(true);

    try {
      await sdk.client.fetch("/admin/priority-author", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          author_id: authorId,
          priority: Number(newValue),
        },
      });

      toast.success("Priority updated ✅");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update priority ❌");
    } finally {
      setIsPending(false);
    }
  };

 return (
      <Select
        value={selectedPriority}
        onValueChange={handleValueChange}
        disabled={isPending}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select priority" />
        </Select.Trigger>
        <Select.Content>
          {[...Array(num)].map((_, i) => {
            const num = (i + 1).toString();
            return (
              <Select.Item key={num} value={num}>
                {num}
              </Select.Item>
            );
          })}
        </Select.Content>
      </Select>
    );
};

export default PrioritySelect;
