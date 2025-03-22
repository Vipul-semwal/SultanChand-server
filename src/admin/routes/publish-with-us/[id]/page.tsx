import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Button } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { sdk } from "../../../lib/sdk";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBookOpen, FaUser } from "react-icons/fa";
import { useState } from "react";

// Type for publishwithusdata
export type PublishWithUsData = {
  id: string;
  author_name: string;
  institute_name: string;
  email: string;
  city: string;
  country: string;
  contact_number: string;
  discipline: string;
  synopsis: string;
  about_author: string;
  author_affiliation: string;
  address: string;
  state: string;
  pin_zip: string;
  title_of_book: string;
  subject: string;
  status_of_book: "Draft" | "Published" | "Under Review";
  created_at: string;
  updated_at: string;
};

const PublishWithUsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery<{ data: PublishWithUsData[] }>({
    queryFn: () => sdk.client.fetch(`/admin/publish-with-us/${id}`, { method: "GET" }),
    queryKey: ["publishWithUs", id],
    enabled: !!id,
  });

  const info = data?.data[0];

  if (!info) return <Heading>Loading...</Heading>;

  return (
    <Container>
      <Heading level="h2" className="mb-6">Publish With Us - Details</Heading>
      <div className="p-6 shadow-lg rounded-2xl">
        <div className="space-y-4">
          <Text className="text-lg font-semibold">{info.author_name}</Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Email" value={info.email} icon={<FaEnvelope />} />
            <InfoItem label="Contact Number" value={info.contact_number} icon={<FaPhone />} />
            <InfoItem label="Institute" value={info.institute_name} icon={<FaUser />} />
            <InfoItem label="Title of Book" value={info.title_of_book} icon={<FaBookOpen />} />
            <InfoItem label="Discipline" value={info.discipline} />
            <InfoItem label="Subject" value={info.subject} />
            <InfoItem label="City" value={info.city} icon={<FaMapMarkerAlt />} />
            <InfoItem label="State" value={info.state} />
            <InfoItem label="Country" value={info.country} />
            <InfoItem label="Pin/ZIP" value={info.pin_zip} />
            <InfoItem label="Status" value={info.status_of_book} />

            <TextAreaItem label="Synopsis" value={info.synopsis} />
            <TextAreaItem label="About Author" value={info.about_author} />
            <TextAreaItem label="Address" value={info.address} />
          </div>

          <Text className="text-sm text-gray-500">Submitted: {new Date(info.created_at).toLocaleString()}</Text>
        </div>
      </div>
    </Container>
  );
};

// Component to display info items
const InfoItem = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-center space-x-2">
    {icon && <span>{icon}</span>}
    <Text className="font-medium">{label}:</Text>
    <Text>{value}</Text>
  </div>
);

// Component to display large text areas
const TextAreaItem = ({ label, value }: { label: string; value: string }) => (
  <div className="col-span-1 md:col-span-2">
    <Text className="font-medium">{label}:</Text>
    <Text>{value}</Text>
  </div>
);

export const config = defineRouteConfig({
  label: "Publish With Us",
});

export default PublishWithUsPage;
