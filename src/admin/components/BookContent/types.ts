export type BookContentSection = {
    title: string;
    content: string | BookContentSection[]; // Recursive type for nested content
    order: number;
  };
  
  export type BookContentType = {
    product_id: string;
    content: BookContentSection[];
    version?: string;
  };

  export type  UpdateBookContentType = {
    id: string;
    product_id: string;
    content: BookContentSection[];
    version?: string;
  }
  