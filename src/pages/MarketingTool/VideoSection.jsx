import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import { deletePromotion } from "../../api/auth-api";
import PopupEdit from "./PopUpEdit";
import { MdModeEdit, MdOutlineFileDownload } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

const VideoSection = ({ videos, setVideoPromotions }) => {
    const videoRefs = useRef([]);
    const [isPlaying, setIsPlaying] = useState(Array(videos.length).fill(false));
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const toggleVideo = (index) => {
        if (videoRefs.current[index]) {
            if (isPlaying[index]) {
                videoRefs.current[index].pause();
            } else {
                videoRefs.current[index].play();
            }
            setIsPlaying((prev) => {
                const updatedState = [...prev];
                updatedState[index] = !updatedState[index];
                return updatedState;
            });
        }
    };

    const handleDownload = async (videoUrl, index) => {
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `video_${index + 1}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
        }
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
            try {
                await deletePromotion(id);
                setVideoPromotions((prev) => prev.filter((item) => item._id !== id));
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
            }
        }
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
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 flex-wrap justify-between items-center">
                <h1>New Products Reels</h1>
                <Button title={"View All"} link={'/all-get-videos'} />
            </div>

            <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {videos.length > 0 ? (
                    videos.slice(0, 4).map((vid, index) => (
                        <div key={vid._id} className="flex flex-col gap-2">
                            <div className="w-full h-80 md:h-96 relative border overflow-hidden rounded-xl group">
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    className="w-full h-full object-cover"
                                    src={vid.link}
                                    controls={false}
                                    loop
                                    muted
                                    autoPlay={false}
                                />

                                <div className="absolute top-0 left-0 w-full h-full bg-black/10 
                                            transition-opacity duration-300 opacity-100 group-hover:opacity-100">
                                    <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 text-white">
                                        <h1 className="capitalize font-medium py-2">
                                            {vid.productName}
                                        </h1>
                                        <div className="flex gap-2 items-center justify-center text-sm">
                                            <button
                                                className="p-1 rounded text-bg-color bg-bg-color1"
                                                onClick={() => toggleVideo(index)}
                                            >
                                                {isPlaying[index] ? <BsPauseCircle /> : <BsPlayCircle />}
                                            </button>
                                            <button
                                                className="p-1 rounded text-bg-color bg-bg-color1"
                                                onClick={() => handleOpenEdit(vid)}
                                            >
                                                <MdModeEdit />
                                            </button>
                                            <button
                                                className="p-1 rounded text-bg-color bg-bg-color1"
                                                onClick={() => handleDelete(vid._id)}
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                            <button
                                                className="p-1 rounded text-bg-color bg-bg-color1"
                                                onClick={() => handleDownload(vid.link, index)}
                                            >
                                                <MdOutlineFileDownload />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No videos available</p>
                )}
            </div>

            {isPopupOpen && (
                <PopupEdit isOpen={isPopupOpen} onClose={handleClosePopup} promotion={selectedPromotion} />
            )}
        </div>
    );
};

export default VideoSection;
