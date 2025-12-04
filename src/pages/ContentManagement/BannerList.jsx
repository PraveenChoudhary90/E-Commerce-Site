import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import img1 from "../../assets/contentmanagement/img1.png";
import img2 from "../../assets/contentmanagement/img2.png";
import img3 from "../../assets/contentmanagement/img3.png";
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
    const [show, setShow] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showView, setShowView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (banners && banners.length) {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [banners]);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteBanner(id);
            Swal.fire({
                icon: "success",
                title: "Banner Deleted!",
                text: "Banner Deleted Successfully",
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
    };

    useEffect(() => {
        getAllBannerList().then((res) => setBanners(res.data));
    }, []);

    return (
        <>
            {loading && <PageLoader />}
            {show && (
                <EditBanner onClick={() => setShow(!show)} title="Add Banner" />
            )}
            <div className="bg-white rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                        User Panel Banner List
                    </h3>
                    <Button
                        title={"Add Banner"}
                        icon={<MdAddCircleOutline />}
                        onClick={() => setShow(!show)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="">
                                <th className="p-3 text-center font-medium">
                                    Image
                                </th>
                                <th className="p-3 text-center font-medium">
                                    SL
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Name
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Banner Type
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Page Name
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Last Update
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Total Image
                                </th>
                                <th className="p-3 text-center font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? banners?.map((_, index) => (
                                      <tr key={index} className="animate-pulse">
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
                                              <div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-6 bg-gray-300 rounded w-6 mx-auto"></div>
                                          </td>
                                          <td className="p-2 text-center">
                                              <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
                                          </td>
                                      </tr>
                                  ))
                                : banners?.map((member, index) => (
                                      <tr key={index} className="border-b">
                                          <td className="p-3">
                                             <img
                                    src={member.images[0]}
                                    alt={`Preview ${index}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
                                    }}
                                    className="p-3 text-center font-light"
                                />
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {index + 1}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {member.banner_name}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {member.banner_type}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {member.banner_page}
                                          </td>
                                          <td className="p-3 text-center font-light">
                                              {dateFormat(member.updatedAt)}
                                          </td>
                                          <td className="p-3 text-center">
                                              {member.images.length}
                                          </td>
                                          <td className="p-3 text-center">
                                              <div className="flex gap-2 justify-center">
                                                  <button
                                                      className="p-2 rounded text-blue-600 bg-blue-100"
                                                      onClick={() => {
                                                          setSelectedBanner(
                                                              member
                                                          );
                                                          setShowView(true);
                                                      }}
                                                  >
                                                      <FaRegEye />
                                                  </button>
                                                  <button
                                                      className="p-2 rounded text-blue-600 bg-blue-100"
                                                      onClick={() => {
                                                          setShowEditForm(true);
                                                          setSelectedBanner(
                                                              member
                                                          );
                                                      }}
                                                  >
                                                      <MdModeEdit />
                                                  </button>
                                                  <button
                                                      className="p-2 rounded text-red-600 bg-red-100"
                                                      onClick={() =>
                                                          handleDelete(
                                                              member._id
                                                          )
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

                {showView && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg  space-y-4  p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">
                                    Banner Details
                                </h2>
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
                                        src={selectedBanner.images[0]}
                                        alt="Banner"
                                        className="w-full object-cover "
                                    />
                                </div>
                                <div className="space-y-3 lg:w-1/3 flex justify-center flex-col">
                                    <div>
                                        <p className="font-medium text-lg text-bg-color">
                                            Hero Banner (User Panel)
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium ">
                                            Current Active Banners Details
                                        </p>
                                    </div>
                                    <p>
                                        <strong>Banner Name:</strong>{" "}
                                        {selectedBanner.banner_name}
                                    </p>
                                    <p>
                                        <strong>Banner Type:</strong>{" "}
                                        {selectedBanner.banner_type}
                                    </p>
                                    <p>
                                        <strong>Page Name:</strong>{" "}
                                        {selectedBanner.banner_page}
                                    </p>
                                    <p>
                                        <strong>Last Updated:</strong>{" "}
                                        {dateFormat(selectedBanner.updatedAt)}
                                    </p>
                                    <p>
                                        <strong>Total Images:</strong>{" "}
                                        {selectedBanner.images.length}
                                    </p>

                                    <div>
                                        <button
                                            className="px-5 w-full py-2 rounded-md bg-bg-color text-white"
                                            onClick={() => {
                                                setShow(!show);
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
                                                setShowEditForm(true);
                                                setSelectedBanner(member);
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

                {showEditForm && (
                    <div className="fixed inset-0 top-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg  space-y-4  p-4">
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
