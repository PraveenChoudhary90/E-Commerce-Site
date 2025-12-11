import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { deletePromotion, fetchPromotion } from "../../api/auth-api";
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import PopupView from "./PopupView";
import PopupEdit from "./PopUpEdit";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";

const ImageSection = ({ images, setImagePromotions }) => {
    const [loading, setLoading] = useState(true);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Ensure loading is set to false when images are available
    useEffect(() => {
        if (images.length > 0) {
            setLoading(false);
        }
    }, [images]);

    const handleOpenPopup = (item, mode) => {
        setSelectedPromotion(item);
        setIsPopupOpen(true);
        setIsEditMode(mode === "edit");
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedPromotion(null);
        setIsEditMode(false);
    };

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmDelete.isConfirmed) {
            setLoading(true);
            try {
                await deletePromotion(id);
                setImagePromotions((prev) => prev.filter((item) => item._id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Promotion has been deleted.",
                });
            } catch (error) {
                console.error("Error deleting promotion:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete promotion. Please try again.",
                });
            } finally {
                setLoading(false); // Ensure loading state resets
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {loading ? (
                <PageLoader />
            ) : (
                <>
                    <div className="flex gap-3 flex-wrap justify-between items-center">
                        <h1>New Product Images</h1>
                        <Button title={"View All"} link={"/all-get-images"} />
                    </div>
                    <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                        {images.length > 0 ? (
                            images.slice(0, 4).map((item, index) => (
                                <div
                                    key={index}
                                    className="w-full h-full flex flex-col gap-4 border overflow-hidden rounded-xl group"
                                >
                                    <div className="w-full p-3 rounded-xl overflow-hidden relative flex flex-col gap-4">
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <h1 className="capitalize font-medium py-2">
                                                {item.productName}
                                            </h1>
                                            <div className="flex gap-2 items-center justify-center text-sm">
                                                <button
                                                    className="p-1 rounded text-bg-color bg-bg-color/10"
                                                    onClick={() => handleOpenPopup(item, "view")}
                                                >
                                                    <FaRegEye />
                                                </button>
                                                <button
                                                    className="p-1 rounded text-bg-color bg-bg-color/10"
                                                    onClick={() => handleOpenPopup(item, "edit")}
                                                >
                                                    <MdModeEdit />
                                                </button>
                                                <button
                                                    className="p-1 rounded text-bg-color bg-bg-color/10"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full h-60 rounded-lg overflow-hidden">
                                           
                                            <img

                                                src={item.file}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No images available</p>
                        )}
                    </div>
                </>
            )}

            {isPopupOpen && (
                isEditMode ? (
                    <PopupEdit isOpen={isPopupOpen} onClose={handleClosePopup} promotion={selectedPromotion} />
                ) : (
                    <PopupView isOpen={isPopupOpen} onClose={handleClosePopup} promotion={selectedPromotion} />
                )
            )}
        </div>
    );
};

export default ImageSection;
