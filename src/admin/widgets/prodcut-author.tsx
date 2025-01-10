import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { clx, Container, Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

// Define the type for AdminProduct with an optional author field
type AdminProductAuthor = AdminProduct & {
  author?: {
    id: string
    name: string
  }
}

const ProductAuthorWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+author.*",
    }),
    queryKey: [["product", product.id]],
  })

  // Safely extract the author's name
  const authorName = (queryResult?.product as AdminProductAuthor)?.author?.name

  return (
    <>
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Author</Heading>
        </div>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Name
        </Text>

        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {authorName || "-"}
        </Text>
      </div>
    </Container>
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Select Author</Heading>
        </div>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Name
        </Text>

        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {authorName || "-"}
        </Text>
      </div>
    </Container>

    </>
  )
}

// Define the widget configuration
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

// Export the component with the correct name
export default ProductAuthorWidget
