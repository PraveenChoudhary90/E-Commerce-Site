import React, { useEffect, useState } from "react";
import { addBanner, getDetails, updateBanner } from "../../api/product-management-api";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";

const DEFAULT_BANNER_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "carousel", label: "Carousel" },
  { value: "sidebar", label: "Sidebar" },
  { value: "footer", label: "Footer" },
  { value: "popup", label: "Popup" },
  { value: "custom", label: "Custom (enter below)" },
];

const EditBanner = ({ title, bannerData, onClick, editmode = false }) => {
  const [select, setSelect] = useState({});
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bannerData) {
      // Ensure existing banner has banner_type (fallback to hero)
      const bannerWithType = {
        ...bannerData,
        banner_type: bannerData.banner_type ?? "hero",
        custom_banner_type: bannerData.banner_type_custom ?? "",
        images: bannerData.images ?? [],
      };
      setBanners([bannerWithType]);
    } else {
      setBanners([
        {
          id: 1,
          title: "Banner 1",
          images: [],
          banner_name: "",
          banner_page: "",
          banner_type: "hero", // default
          custom_banner_type: "", // text input if type === 'custom'
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
      banner_type: "hero",
      custom_banner_type: "",
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

    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === id ? { ...banner, images: [...banner.images, ...base64Images] } : banner
      )
    );
  };

  const handleBannerSave = async () => {
    // Normalize banner_type: if 'custom' chosen, prefer custom_banner_type value
    const payload = banners.map((b) => {
      const finalType = b.banner_type === "custom" ? (b.custom_banner_type || "custom") : b.banner_type;
      return {
        ...b,
        banner_type: finalType,
        // remove helper key before sending if needed by API
        custom_banner_type: undefined,
      };
    });

    if (bannerData) {
      const updatedBanner = payload[0];
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
        await addBanner(payload);
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
          {!editmode && (
            <button onClick={onClick} className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center rounded-full text-white text-2xl">
                &times;
              </div>
            </button>
          )}
        </div>

        {banners?.map((banner) => (
          <div key={banner.id} className="grid gap-5 grid-cols-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              {banner.images.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2">
                  {banner.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt="Banner Preview" className="w-24 h-24 object-cover rounded-md" />
                      <button
                        onClick={() => removeImage(banner.id, index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs p-1"
                        type="button"
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
                  type="button"
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

                <div>
                  <label className="block text-sm font-medium mb-2">Banner Type</label>
                  <select
                    value={banner.banner_type}
                    onChange={(e) => handleInputChange(banner.id, "banner_type", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    {DEFAULT_BANNER_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* Show custom type text input when 'custom' selected */}
                  {banner.banner_type === "custom" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">Custom Type</label>
                      <input
                        type="text"
                        value={banner.custom_banner_type}
                        placeholder="Enter custom banner type"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={(e) => handleInputChange(banner.id, "custom_banner_type", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={addNewSlide}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            type="button"
          >
            Add More Slides
          </button>

          <button
            onClick={handleBannerSave}
            className="px-6 py-2 bg-green-400 text-white rounded-md shadow hover:bg-green-600"
            type="button"
          >
            {bannerData ? "Update Banner" : "Save Banner"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditBanner;
