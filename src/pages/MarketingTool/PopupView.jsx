import React from "react";

const PopupView = ({ isOpen, onClose, promotion }) => {
    if (!isOpen || !promotion) return null;

    return (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="w-full h-60 rounded-lg overflow-hidden">
                    {promotion?.link && (
                        <img
                            src={promotion.link}
                            alt="Promotion"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">{promotion?.productName}</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-sm text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupView;
