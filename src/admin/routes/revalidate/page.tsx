import { defineRouteConfig } from "@medusajs/admin-sdk"
import { GrValidate } from "react-icons/gr";
import "./validate.css"

import  { useState } from 'react';
import { toast } from "@medusajs/ui";
const baseurl =  "http://localhost:3003";
// const baseurl = "https://store.sultanchandandsons.com"

const RevalidateButton = () => {
  const [loading, setLoading] = useState(false);

  const handleRevalidate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${baseurl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
       toast.success('Revalidation successful!',)
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Revalidation failed');
      }
    } catch (error) {
      toast.error("Revalidation failed: ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="revalidate-container">
      <button 
        onClick={handleRevalidate}
        disabled={loading}
        className={`revalidate-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Revalidating...
          </>
        ) : 'Revalidate'}
      </button>
    </div>
  )
};

export default RevalidateButton;

export const config = defineRouteConfig({
  label: "validate",
  icon: GrValidate ,
})