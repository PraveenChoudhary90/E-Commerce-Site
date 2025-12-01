import React, { useEffect, useState } from "react";
import {createStaticBanner, getDetails, updateBanner, updateStaticBanner } from "../../api/product-management-api";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";


const EditBanner = ({ title, bannerData, onClick, editmode = false }) => {
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
          image: "",
          brand: "",
          name: "",
          status: "",
        },
      ]);
    }
  }, [bannerData]);

  const addNewSlide = () => {
    const newBanner = {
      id: 1,
          image: "",
          brand: "",
          name: "",
          status: "",
    };
    setBanners([...banners, newBanner]);
  };

  const handleInputChange = (id, field, value) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) => (banner.id === id ? { ...banner, [field]: value } : banner))
    );
  };
  const handleImageUpload = async (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBanners((prevBanners) =>
        prevBanners.map((banner) => (banner.id === id ? { ...banner, image: reader.result } : banner))
      );
    };
  };



  const handleBannerSave = async () => {
    if (bannerData) {
      const updatedBanner = banners[0];
      try {
        setLoading(true);
        await updateStaticBanner( updatedBanner,bannerData._id,);
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
        await createStaticBanner(banners);
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
            <div className="bg-white rounded-lg border overflow-hidden w-full h-full">
              {banner.image && (
                <div className="relative w-full h-full">
                  <img src={banner.image} alt="Banner Preview" className="w-full h-full object-cover rounded-md" />
                </div>
              )}
            </div>

            <div className="p-4 bg-white space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{banner.name}</h3>
                <button
                  onClick={() => removeSlide(banner.id)}
                  className="px-4 py-2 bg-red-500 text-sm text-white rounded-md shadow hover:bg-red-600"
                >
                  Delete Slide
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Image</label>
                  <input
                    type="file"
                   
                    className="w-full px-4 py-2 border rounded-md"
                    onChange={(e) => handleImageUpload(banner.id, e)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Name</label>
                  <input
                    type="text"
                    value={banner.name}
                    className="w-full px-4 py-2 border rounded-md"
                    onChange={(e) => handleInputChange(banner.id, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Brand (Optional)</label>
                  <select
                    className="w-full px-4 py-2 border rounded-md"
                    value={banner.brand}
                    onChange={(e) => handleInputChange(banner.id, "brand", e.target.value)}
                  >
                    <option value="">Choose</option>

                    {select?.brands?.map((el) => (
                      <option value={el._id}>{el.name}</option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">Banner Status</label>
                  <select
                    className="w-full px-4 py-2 border rounded-md"
                    value={banner.status ? "active":"inactive"}
                    onChange={(e) => handleInputChange(banner.id, "status", e.target.value)}
                  >
                    <option value="">Choose</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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