import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { Container,Button} from "@medusajs/ui";
import { useNavigate } from "react-router-dom";

const ProductReviewWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {

    const navigate = useNavigate();
  return (
    <>
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Button onClick={()=>{
             navigate(`/review/${product.id}`)
          }}>View Reviews</Button>
        </div>
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
export default ProductReviewWidget
