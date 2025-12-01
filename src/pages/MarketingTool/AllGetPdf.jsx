import React, { useEffect, useState } from "react";
import { fetchPromotion, deletePromotion } from "../../api/auth-api";
import { FaFilePdf, FaRegEye } from "react-icons/fa";
import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import PopupEdit from "./PopUpEdit";

const AllGetPdf = () => {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPromotion();
                if (response) {
                    const filteredPdfs = response.filter((item) => item.type === "pdf");
                    setPdfs(filteredPdfs);
                }
            } catch (error) {
                console.error("Error fetching product list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                setPdfs((prev) => prev.filter((item) => item._id !== id));
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
                setLoading(false);
            }
        }
    };

    const handleViewPdf = (link) => {
        window.open(link, "_blank");
    };

    const handleOpenEdit = (promotion) => {
        setSelectedPromotion(promotion);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedPromotion(null);
    };

    return (
        <div className="flex flex-col gap-6">
            {loading ? (
                <PageLoader />
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                        {pdfs.length > 0 ? (
                            pdfs.map((pdf, index) => (
                                <div key={index} className="w-full h-full flex flex-col gap-4 border overflow-hidden rounded-xl group">
                                    <div className="w-full p-4 flex flex-col items-center justify-center bg-bg-color1 rounded-xl transition">
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <h1 className="capitalize font-medium py-2">{pdf.productName}</h1>

                                            <div className="flex gap-2 items-center justify-center text-sm">
                                                <button
                                                    className="p-1 rounded text-bg-color bg-bg-color/10"
                                                    onClick={() => handleViewPdf(pdf.link)}
                                                >
                                                    <FaRegEye />
                                                </button>
                                                <button
                                                    className="p-1 rounded text-bg-color bg-bg-color/10"
                                                    onClick={() => handleOpenEdit(pdf)}
                                                >
                                                    <MdModeEdit />
                                                </button>
                                                <button
                                                    className="p-1 rounded text-bg-color bg-bg-color/10"
                                                    onClick={() => handleDelete(pdf._id)}
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center flex-col gap-3">
                                            <FaFilePdf className="text-red-500 text-6xl" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No PDFs available</p>
                        )}
                    </div>
                </div>
            )}
            <Footer1 />

            {isPopupOpen && (
                <PopupEdit isOpen={isPopupOpen} onClose={handleClosePopup} promotion={selectedPromotion} />
            )}
        </div>
    );
};

export default AllGetPdf;
