import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const ImageViewField = ({ image, title, text }) => {
    const [showImage, setShowImage] = useState(false);
    return (
        <div className="col-span-1">
            <h1 className="text-sm text-gray-700 mb-2 capitalize">{title}</h1>
            <div className="flex justify-between items-center">
                <p className="text-sm text-black/50 capitalize">
                    {text ? text : "click to view"}
                </p>
                <button
                    onClick={() => setShowImage(true)}
                    className="p-2 rounded text-blue-950 bg-blue-950/10"
                >
                    <FaRegEye />
                </button>
                {showImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative p-10 w-full md:w-1/2 h-1/2">
                            <p className="text-white text-sm mb-2">{title}</p>
                            <img
                                src={image}
                                alt="profile photo"
                                className="w-full object-cover rounded-xl"
                            />
                            <button
                                onClick={() => setShowImage(false)}
                                className="absolute top-10 right-10 md:top-0 md:right-0 p-2 text-white bg-black rounded-full"
                            >
                                <IoClose />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

ImageViewField.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
};

export default ImageViewField;
