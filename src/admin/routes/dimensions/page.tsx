import { defineRouteConfig } from "@medusajs/admin-sdk"
import { RxDimensions } from "react-icons/rx";
import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useState } from 'react';
import { FaExpand, FaCheck, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { RiProductHuntFill } from "react-icons/ri";
import { CiLollipop } from "react-icons/ci";
import { TbBrandOauth } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";

// Define interface for component data
interface ComponentItem {
  name: string;
  icon: JSX.Element;
  dimensions: { width: number; height: number };
  bannerImage: string;
}

// Mock data array with type annotation
const componentsData: ComponentItem[] = [
  {
    name: "Banner",
    icon: <FaExpand />,
    dimensions: { width: 3780, height: 940 },
  },
  {
    name:"Product",
    icon:<RiProductHuntFill/>,
    dimensions:{width:220, height:289}
  },
  {
    name:"PopUp",
    icon:< CiLollipop />,
    dimensions:{width:728, height:364}
  },
  {
    name:"AnnounceMent",
    icon:<GrAnnounce />,
    dimensions:{width:391, height:84}
  },
  {
    name:"Author",
    icon:<TbBrandOauth />,
    dimensions:{width:276, height:276}
  }

  // Add more components as needed
];

interface CardComponentProps {
  item: ComponentItem;
}

const CardComponent: React.FC<CardComponentProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const isValid = 
          img.naturalWidth === item.dimensions.width &&
          img.naturalHeight === item.dimensions.height;
        
        setValidationResult(isValid);
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
    {/* Banner Button */}
    <div
      onClick={() => setIsModalOpen(true)}
      className="w-[190px] h-[40px] relative cursor-pointer rounded-md overflow-hidden shadow-md bg-cover bg-center flex items-center justify-center transition-transform hover:scale-105"
      style={{ backgroundImage: `url(${item.bannerImage})` }}
    >
      <div className="flex items-center bg-black bg-opacity-50 w-full h-full px-2">
        <div>{item.icon}</div>
        <h3 className="ml-2 text-white font-medium">{item.name}</h3>
      </div>
    </div>
  
    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg p-6 w-[90%] max-w-md shadow-lg">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            onClick={() => {
              setIsModalOpen(false);
              setUploadedImage(null);
              setValidationResult(null);
            }}
          >
            <IoCloseCircleOutline />
          </button>
  
          {/* Modal Header */}
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Upload Image for {item.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
            Required dimensions: {item.dimensions.width}x{item.dimensions.height}
          </p>
  
          {/* Upload Section */}
          <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <FaCloudUploadAlt className="text-4xl text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Click to upload image</p>
          </label>
  
          {/* Uploaded Image Preview */}
          {uploadedImage && (
            <div className="mt-4 text-center">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="max-w-[200px] max-h-[200px] mx-auto rounded-md"
              />
              <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                {validationResult ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <FaTimes className="text-red-500" />
                )}
                <span className={validationResult ? "text-green-600" : "text-red-600"}>
                  {validationResult ? "Valid dimensions!" : "Invalid dimensions!"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </>
  
  );
};

// Main component to display all cards
const ComponentGallery: React.FC = () => {
  return (
    <div class="flex flex-col gap-5 align-item">
      {componentsData.map((item) => (
        <CardComponent key={item.name} item={item} />
      ))}
    </div>
  );
};

export default ComponentGallery;





export const config = defineRouteConfig({
  label: "check dimensions",
  icon: RxDimensions,
})