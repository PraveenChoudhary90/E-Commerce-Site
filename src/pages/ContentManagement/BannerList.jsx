import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import Button from "../../components/Button";
import {
    deleteBanner,
    getAllBannerList,
} from "../../api/product-management-api";
import EditBanner from "./EditBanner";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";

const dateFormat = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const BannerList = () => {
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [banners, setBanners] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showView, setShowView] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch banners
    const fetchBanners = async () => {
        try {
            const res = await getAllBannerList();
            setBanners(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // Delete banner
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await deleteBanner(id);
                // Remove from state instantly
                setBanners((prevBanners) =>
                    prevBanners.filter((banner) => banner._id !== id)
                );

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Banner has been deleted.",
                });
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
        }
    };

    return (
        <>
            {loading && <PageLoader />}
            {showAddForm && (
  <EditBanner
      onClick={() => setShowAddForm(false)}
      title="Add Banner"
      bannerData={null}
      onSaveSuccess={(newBanner) => {
          // Add new banner instantly
          setBanners((prev) => [...prev, ...newBanner]);
          setShowAddForm(false);
      }}
  />
)}


            <div className="bg-white rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">User Panel Banner List</h3>
                    <Button
                        title={"Add Banner"}
                        icon={<MdAddCircleOutline />}
                        onClick={() => setShowAddForm(true)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr>
                                <th className="p-3 text-center font-medium">Image</th>
                                <th className="p-3 text-center font-medium">SL</th>
                                <th className="p-3 text-center font-medium">Name</th>
                                <th className="p-3 text-center font-medium">Banner Type</th>
                                <th className="p-3 text-center font-medium">Page Name</th>
                                <th className="p-3 text-center font-medium">Total Image</th>
                                <th className="p-3 text-center font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-5">
                                        No banners found.
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner, index) => (
                                    <tr key={banner._id} className="border-b">
                                        <td className="p-3 text-center">
                                            <img
                                                src={
                                                    banner.images[0] ||
                                                    "https://via.placeholder.com/150"
                                                }
                                                alt={`Banner ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded-md mx-auto"
                                            />
                                        </td>
                                        <td className="p-3 text-center">{index + 1}</td>
                                        <td className="p-3 text-center">{banner.banner_name}</td>
                                        <td className="p-3 text-center">{banner.banner_type}</td>
                                        <td className="p-3 text-center">{banner.banner_page}</td>
                                        <td className="p-3 text-center">{banner.images.length}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex gap-2 justify-center">
                                                {/* <button
                                                    className="p-2 rounded text-blue-600 bg-blue-100"
                                                    onClick={() => {
                                                        setSelectedBanner(banner);
                                                        setShowView(true);
                                                    }}
                                                >
                                                    <FaRegEye />
                                                </button> */}
                                                <button
                                                    className="p-2 rounded text-blue-600 bg-blue-100"
                                                    onClick={() => {
                                                        setSelectedBanner(banner);
                                                        setShowEditForm(true);
                                                    }}
                                                >
                                                    <MdModeEdit />
                                                </button>
                                                <button
                                                    className="p-2 rounded text-red-600 bg-red-100"
                                                    onClick={() => handleDelete(banner._id)}
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Banner Modal */}
            {showEditForm && selectedBanner && (
                <div className="fixed inset-0 top-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg p-4">
                        <div className="flex gap-4">
                           <EditBanner
  title="Edit Banner"
  bannerData={selectedBanner}
  editmode={true}
  onSaveSuccess={(updatedBanner) => {
    setBanners((prev) =>
      prev.map((b) =>
        b._id === updatedBanner._id ? updatedBanner : b
      )
    );
    setShowEditForm(false);
  }}
/>

                            <button
                                className=" bg-red-500 w-8 h-7 rounded-full flex items-center justify-center"
                                onClick={() => setShowEditForm(false)}
                            >
                                <div className="w-7 h-7 border-2 flex items-center justify-center rounded-full text-white text-2xl">
                                    &times;
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BannerList;
