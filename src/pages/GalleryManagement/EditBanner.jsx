import React, { useEffect, useState } from "react";
import { addBanner, getDetails, updateBanner } from "../../api/product-management-api";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import { addEvent, updateEvent } from "../../api/auth-api";

const EditBanner = ({ title, bannerData, onClick, editmode = false }) => {
  const [banner, setBanner] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bannerData) {
      setBanner({
        ...bannerData,
        title: bannerData.title || "",
        description: bannerData.description || "",
        images: bannerData.images || [],
      });
    }
  }, [bannerData]);

  const handleInputChange = (field, value) => {
    setBanner((prevBanner) => ({
      ...prevBanner,
      [field]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    const base64Images = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result);
          })
      )
    );

    setBanner((prevBanner) => ({
      ...prevBanner,
      images: [...prevBanner.images, ...base64Images],
    }));
  };

  const handleBannerSave = async () => {
    try {
      setLoading(true);
      if (bannerData) {
        await updateEvent(bannerData._id, banner);
        Swal.fire({
          icon: "success",
          title: "Event updated!",
          text: "Event updated Successfully",
        }).then(() => window.location.reload());
      } else {
        await addEvent(banner); // API may expect array
        Swal.fire({
          icon: "success",
          title: "Event saved!",
          text: "New Event added Successfully",
        }).then(() => window.location.reload());
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (imageIndex) => {
    setBanner((prevBanner) => ({
      ...prevBanner,
      images: prevBanner.images.filter((_, index) => index !== imageIndex),
    }));
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white p-4 rounded-xl space-y-7">
        <div className="flex items-center gap-5 justify-between">
          <h2 className="lg:text-2xl text-xl font-medium mb-4">{title}</h2>
          {!editmode && (
            <button
              onClick={onClick}
              className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center"
            >
              <div className="w-full h-full flex items-center justify-center rounded-full text-white text-2xl">
                &times;
              </div>
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 grid-cols-1 md:grid-flow-row grid-flow-row-dense">
          <div className="order-2 md:order-1 bg-white rounded-lg border overflow-hidden">
            {banner.images.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2">
                {banner.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt="Banner Preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 md:order-2 p-4 bg-white space-y-5">
            <h3 className="text-lg font-medium">{banner.title} Image & Direction</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title</label>
                <input
                  type="text"
                  value={banner.title}
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={banner.description}
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Images <span className="text-xs opacity-70">(Size 1024x1024)</span></label>
                <input
                  type="file"
                  multiple
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={handleBannerSave}
            className="px-6 py-2 bg-green-400 text-white rounded-md shadow hover:bg-green-600"
          >
            {bannerData ? "Update Event" : "Save Event"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditBanner;