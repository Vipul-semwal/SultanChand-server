import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DecisionProcess,DocumentText, User,Server,UserGroup } from "@medusajs/icons"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { sdk } from "../../../lib/sdk"

type SpecimenRequest = {
  id: string
  email: string
  phone_number: string
  mobile_number: string
  name: string
  school_name: string
  school_address: string
  residence_address: string
  category_name: string
  title_category: string
  title_name: string
  state: string
  city: string
  pin_code: string
  photo_id: string
  letter_head: string
  strength: string
  created_at: string
  updated_at: string
}

const SpecimenData = () => {
  const { id } = useParams<{ id: string }>()

  const { data } = useQuery<{ data: SpecimenRequest[] }>({
    queryFn: () => sdk.client.fetch(`/admin/specimenRequest/${id}`, { method: "GET" }),
    queryKey: ["specimenRequest", id],
    enabled: !!id,
  })

  const info = data?.data[0]

  if (!info) return <Heading>Loading...</Heading>
  console.log('didid',info)

  return (
    <Container>
      <Heading level="h2" className="mb-6">Specimen Request Details</Heading>
      <div className="p-6 shadow-lg rounded-2xl">
        <div className="space-y-4">
          <Text className="text-lg font-semibold">{info.name}</Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Email" value={info.email} />
            <InfoItem label="Phone" value={info.phone_number} icon={<Server />} />
            <InfoItem label="Mobile" value={info.mobile_number} icon={<Server />} />
            <InfoItem label="School" value={info.school_name} icon={<UserGroup />} />
            <InfoItem label="School Address" value={info.school_address} />
            <InfoItem label="Residence" value={info.residence_address} />
            <InfoItem label="Category" value={info.category_name} />
            <InfoItem label="Title" value={`${info.title_category} - ${info.title_name}`} />
            <InfoItem label="State" value={info.state} />
            <InfoItem label="City" value={info.city} />
            <InfoItem label="Pin Code" value={info.pin_code} />
            <InfoItem label="Strength" value={info.strength} />

            {/* Links with Icons */}
            <LinkItem label="Photo ID" href={info.photo_id} />
            <LinkItem label="Letter Head" href={info.letter_head} />
          </div>

          <Text className="text-sm text-gray-500">Submited: {new Date(info.created_at).toLocaleString()}</Text>
        </div>
      </div>
    </Container>
  )
}

// Component to display info items
const InfoItem = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-center space-x-2">
    {icon && <span>{icon}</span>}
    <Text className="font-medium">{label}:</Text> 
    <Text>{value}</Text>
  </div>
)

// Component for clickable links
const LinkItem = ({ label, href }: { label: string; href: string }) => (
  <a href={href}>
    <div className="flex items-center space-x-2">
    <Text className="font-medium">{label}:</Text>
    <Button    variant="secondary" size="small">
      View <DocumentText className="ml-1" />
    </Button>
  </div>
  </a>
)

export const config = defineRouteConfig({
  label: "Specimen Details",
  icon: DecisionProcess,
})

export default SpecimenData
