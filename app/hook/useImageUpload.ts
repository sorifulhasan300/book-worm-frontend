import { useState } from "react";

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_preset");
      formData.append("cloud_name", "dkahobzux");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setLoading(false);
      return data.secure_url;
    } catch (err) {
      setError("Image upload failed");
      setLoading(false);
      return null;
    }
  };

  return { uploadImage, loading, error };
};
