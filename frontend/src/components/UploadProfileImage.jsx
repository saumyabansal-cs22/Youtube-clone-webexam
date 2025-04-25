import { useState } from 'react';
import { axiosInstance } from "../utils/axiosConfig";  // Replace Firebase with Axios for uploading
import Swal from "sweetalert2";

const UploadProfileImage = () => {
  const [image, setImage] = useState(null);
  const [imagePerc, setImagePerc] = useState(0);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      // Assuming your backend is set up to handle this upload
      const res = await axiosInstance.post("/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("Success", "Image uploaded successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Unable to upload image", "error");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={uploadImage}>Upload Image</button>
    </div>
  );
};

export default UploadProfileImage;
