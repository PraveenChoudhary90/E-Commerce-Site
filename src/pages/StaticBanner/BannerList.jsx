import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import Button from "../../components/Button";
import {
    deleteStaticBanner,
    getStaticBanner,
} from "../../api/product-management-api";
import EditBanner from "./EditBanner";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";

const dateFormat = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
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
    const [loading, setLoading] = useState(false); // for page-level loader (deletes etc.)
    const [isLoading, setIsLoading] = useState(true); // for initial fetch / skeleton

    // Fetch banners
    useEffect(() => {
        let mounted = true;
        const fetchBanners = async () => {
            setIsLoading(true);
            try {
                const res = await getStaticBanner();
                // console.log("API Response:", res);
                if (!mounted) return;
                if (res?.data?.data) {
                    setBanners(res.data.data);
                } else {
                    setBanners([]);
                }
            } catch (err) {
                console.error("Failed to fetch banners:", err);
                setBanners([]);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err?.response?.data?.message || "Failed to load banners",
                });
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchBanners();
        return () => {
            mounted = false;
        };
    }, []);

    // Delete handler: updates state instead of reloading
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the banner.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
        });
        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            await deleteStaticBanner(id);
            setBanners((prev) => prev.filter((b) => b._id !== id));
            // if the deleted banner was open in a modal, close it
            if (selectedBanner?._id === id) {
                setShowView(false);
                setShowEditForm(false);
                setSelectedBanner(null);
            }
            Swal.fire({
                icon: "success",
                title: "Banner Deleted!",
                text: "Banner Deleted Successfully",
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
    };

    // Fixed number of skeleton rows while loading
    const SKELETON_ROWS = Array.from({ length: 5 });

    return (
        <>
            {loading && <PageLoader />}
            {showAddForm && (
                <EditBanner
                    onClick={() => setShowAddForm(false)}
                    title="Add Banner"
                />
            )}
            <div className="bg-white rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Static Banner List</h3>
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
                                <th className="p-3 text-center font-medium">
                                    Image
                                </th>
                                <th className="p-3 text-center font-medium">SL</th>
                                <th className="p-3 text-center font-medium">
                                    Name
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Banner Status
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Brand
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? SKELETON_ROWS.map((_, index) => (
                                      <tr
                                          key={`skeleton-${index}`}
                                          className="animate-pulse"
                                      >
                                          <td className="p-2 text-center">
                                              <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-6 bg-gray-300 rounded w-6 mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-6 w-20 bg-gray-300 rounded mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-6 bg-gray-300 rounded w-20 mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-6 bg-gray-300 rounded w-24 mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
                                          </td>
                                      </tr>
                                  ))
                                : banners?.map((member, index) => (
                                      <tr key={member._id || index} className="border-b">
                                          <td className="p-3">
                                              <img
                                                  src={member?.images}
                                                  className="w-full h-10 object-cover rounded-md"
                                                  alt={member?.name || "banner"}
                                              />
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {index + 1}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {member?.name || "-"}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {member?.status ? "Active" : "InActive"}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {member?.brand || "-"}
                                          </td>
                                          <td className="p-3 text-center">
                                              <div className="flex gap-2 justify-center">
                                                  <button
                                                      className="p-2 rounded text-blue-600 bg-blue-100"
                                                      onClick={() => {
                                                          setSelectedBanner(member);
                                                          setShowView(true);
                                                      }}
                                                  >
                                                      <FaRegEye />
                                                  </button>
                                                  <button
                                                      className="p-2 rounded text-blue-600 bg-blue-100"
                                                      onClick={() => {
                                                          setSelectedBanner(member);
                                                          setShowEditForm(true);
                                                      }}
                                                  >
                                                      <MdModeEdit />
                                                  </button>
                                                  <button
                                                      className="p-2 rounded text-red-600 bg-red-100"
                                                      onClick={() =>
                                                          handleDelete(member._id)
                                                      }
                                                  >
                                                      <RiDeleteBin6Line />
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                        </tbody>
                    </table>
                </div>

                {/* View Modal */}
                {showView && selectedBanner && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg space-y-4 p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">Banner Details</h2>
                                <button
                                    className=" bg-red-500 w-10 h-10 rounded-full flex items-center justify-center"
                                    onClick={() => {
                                        setShowView(false);
                                        setSelectedBanner(null);
                                    }}
                                >
                                    <div className="w-7 h-7 border-2 flex items-center justify-center rounded-full text-white text-2xl">
                                        &times;
                                    </div>
                                </button>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:gap-8 gap-5">
                                <div className="lg:w-2/3 h-auto rounded-xl border overflow-hidden bg-white">
                                    <img
                                        src={selectedBanner?.image}
                                        alt="Banner"
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="space-y-3 lg:w-1/3 flex justify-center flex-col">
                                    <div>
                                        <p className="font-medium text-lg text-bg-color">
                                            Static Banner (User Panel)
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium ">
                                            Current Active Banners Details
                                        </p>
                                    </div>
                                    <p>
                                        <strong>Banner Name:</strong>{" "}
                                        {selectedBanner?.name || "-"}
                                    </p>

                                    <p>
                                        <strong>Last Updated:</strong>{" "}
                                        {dateFormat(selectedBanner?.updatedAt)}
                                    </p>

                                    <div>
                                        <button
                                            className="px-5 w-full py-2 rounded-md bg-bg-color text-white"
                                            onClick={() => {
                                                setShowAddForm(true);
                                                setShowView(false);
                                            }}
                                        >
                                            Add More Slider
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="px-5 w-full py-2 rounded-md bg-green-500 text-white"
                                            onClick={() => {
                                                // Use selectedBanner (not undefined "member")
                                                setShowEditForm(true);
                                                // selectedBanner already set
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-5 w-full py-2 rounded-md bg-red-500 text-white"
                                            onClick={() =>
                                                handleDelete(selectedBanner._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditForm && (
                    <div className="fixed inset-0 top-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg space-y-4 p-4">
                            <div className="flex gap-4">
                                <EditBanner
                                    title={"Edit Banner"}
                                    bannerData={selectedBanner}
                                    editmode={true}
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
            </div>
        </>
    );
};

export default BannerList;
