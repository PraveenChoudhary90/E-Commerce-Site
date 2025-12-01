import React, { useEffect, useState } from "react";
import { addBanner, getDetails, updateBanner } from "../../api/product-management-api";
import { imageBase64Convertor } from "../../utils/additionalFunction";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";

const EditBanner = ({ title, bannerData , onClick , editmode = false}) => {
  const [select, setSelect] = useState({});
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bannerData) {
      setBanners([bannerData]);
    } else {
      setBanners([
        {
          id: 1,
          title: "Banner 1",
          images: [],
          banner_name: "",
          banner_page: "",
        },
      ]);
    }
  }, [bannerData]);

  const addNewSlide = () => {
    const newBanner = {
      id: banners.length + 1,
      title: `Banner ${banners.length + 1}`,
      images: [],
      banner_name: "",
      banner_page: "",
    };
    setBanners([...banners, newBanner]);
  };

  const handleInputChange = (id, field, value) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) => (banner.id === id ? { ...banner, [field]: value } : banner))
    );
  };
  const handleImageUpload = async (id, event) => {
    const files = Array.from(event.target.files);
  
    // Convert files to base64
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
  
    // Update state with new images added to the existing ones
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === id
          ? { ...banner, images: [...banner.images, ...base64Images] } // Append new images to existing ones
          : banner
      )
    );
  };
  
  

  const handleBannerSave = async () => {
    if (bannerData) {
      const updatedBanner = banners[0];
      try {
        setLoading(true);
        await updateBanner(bannerData._id, updatedBanner);
        Swal.fire({
          icon: "success",
          title: "Banner updated!",
          text: "Banner updated Successfully",
        }).then(() => window.location.reload());
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await addBanner(banners);
        Swal.fire({
          icon: "success",
          title: "Banner saved!",
          text: "New Banner added Successfully",
        }).then(() => window.location.reload());
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const removeSlide = (id) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  useEffect(() => {
    getDetails().then((res) => setSelect(res));
  }, []);

  const removeImage = (bannerId, imageIndex) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === bannerId
          ? { ...banner, images: banner.images.filter((_, index) => index !== imageIndex) }
          : banner
      )
    );
  };


  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white p-4 rounded-xl space-y-7">
        <div className="flex items-center gap-5 justify-between">
          <h2 className="lg:text-2xl text-xl font-medium mb-4">{title}</h2>
        {!editmode && (<button onClick={onClick} className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center rounded-full text-white text-2xl">
              &times;
            </div>
          </button>)}  
        </div>
        {banners?.map((banner) => (
          <div key={banner.id} className="grid gap-5 grid-cols-2">
            <div className="bg-white rounded-lg  border overflow-hidden">
              {banner.images.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2">
                  {banner.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt="Banner Preview" className="w-24 h-24 object-cover rounded-md" />
                      <button
                        onClick={() => removeImage(banner.id, index)} // Delete image
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{banner.title} Image & Direction</h3>
                <button
                  onClick={() => removeSlide(banner.id)}
                  className="px-4 py-2 bg-red-500 text-sm text-white rounded-md shadow hover:bg-red-600"
                >
                  Delete Slide
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Images</label>
                  <input
                    type="file"
                    multiple
                    className="w-full px-4 py-2 border rounded-md"
                    onChange={(e) => handleImageUpload(banner.id, e)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Name</label>
                  <input
                    type="text"
                    value={banner.banner_name}
                    className="w-full px-4 py-2 border rounded-md"
                    onChange={(e) => handleInputChange(banner.id, "banner_name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Page</label>
                  <input
                    type="text"
                    value={banner.banner_page}
                    className="w-full px-4 py-2 border rounded-md"
                    onChange={(e) => handleInputChange(banner.id, "banner_page", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={addNewSlide}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            Add More Slides
          </button>

          <button
            onClick={handleBannerSave}
            className="px-6 py-2 bg-green-400 text-white rounded-md shadow hover:bg-green-600"
          >
            {bannerData ? "Update Banner" : "Save Banner"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditBanner;
