import { defineRouteConfig } from "@medusajs/admin-sdk"
import { RxDimensions } from "react-icons/rx";
import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useState } from 'react';
import { FaExpand, FaCheck, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { RiProductHuntFill } from "react-icons/ri";

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
      <div 
        className="ml-20" 
        onClick={() => setIsModalOpen(true)}
        style={{
          width: `30px`,
          height: `40px`,
          cursor: 'pointer',
          position: 'relative',
          background: `url(${item.bannerImage}) no-repeat center/cover`
        }}
      >
        <div className="flex items-center justify-center">
        <div>
        {item.icon}
        </div>
          <h3 style={{ marginLeft: '10px' }}>{item.name}</h3>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          >
          <div className="modal-content" style={{
            backgroundColor: 'black',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>Upload Image for {item.name}</h2>
            <p>Required dimensions: {item.dimensions.width}x{item.dimensions.height}</p>
            <button 
             className="absolute top-0 right-0 text-[20px]"
              onClick={() => {
                setIsModalOpen(false);
                setUploadedImage(null);
                setValidationResult(null);
              }}
              
            >
              <IoCloseCircleOutline />
            </button>
            <label style={{
              border: '2px dashed #ccc',
              padding: '20px',
              display: 'inline-block',
              cursor: 'pointer'
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }}
              />
              <FaCloudUploadAlt size={40} />
              <p>Click to upload image</p>
            </label>

            {uploadedImage && (
              <div style={{ marginTop: '20px' }}>
                <img 
                  src={uploadedImage} 
                  alt="Uploaded preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {validationResult ? (
                    <FaCheck style={{ color: 'green', marginLeft: '10px' }} />
                  ) : (
                    <FaTimes style={{ color: 'red', marginLeft: '10px' }} />
                  )}
                  <p>{validationResult ? "Valid dimensions!" : "Invalid dimensions!"}</p>
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
    <div class="flex flex-col">
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