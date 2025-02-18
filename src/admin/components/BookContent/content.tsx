import { useState } from "react";
import { Button } from "@medusajs/ui";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg shadow-md p-4 bg-white text-sm leading-relaxed">{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

interface ContentItem {
  order: number;
  title: string;
  content: string | ContentItem[];
}

interface BookContentProps {
  book_content: {
    content: ContentItem[];
    created_at: string;
    deleted_at: string | null;
    id: string;
    product_id: string;
    updated_at: string;
    version: string;
  };
}

const RecursiveContent = ({ content }: { content: string | ContentItem[] }) => {
  if (typeof content === "string") {
    return (
      <pre className="ml-4 text-gray-700 whitespace-pre-wrap text-sm leading-6 border-l-2 pl-2">{content}</pre>
    );
  }

  return (
    <ul className=" border-l pl-4 space-y-2 list-disc text-sm leading-6">
      {content.map((item) => (
        <li key={item.order} className="space-y-2">
          <h3 className="font-semibold text-base text-gray-900">{item.title}</h3>
          <RecursiveContent content={item.content} />
        </li>
      ))}
    </ul>
  );
};

export default function BookContent({ book_content }: BookContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Button onClick={() => setIsEditing(!isEditing)} variant="secondary">
        {isEditing ? "Save" : "Edit"}
      </Button>
      
      <Card>
        <CardContent>
          {book_content.content.map((chapter) => (
            <div key={chapter.order} className="border-b pb-4 last:border-b-0">
              <h2 className="text-md font-bold text-gray-900 border-b">{chapter.title}</h2>
              <RecursiveContent content={chapter.content} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
