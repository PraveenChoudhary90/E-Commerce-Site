import React, { useEffect, useState } from "react";
import SelectComponent from "../../components/SelectComponent";
import InputField from "../../components/InputField";
import { getAllProductList } from "../../api/product-management-api";
import { updatePromotion } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import Swal from "sweetalert2";
import { imageBase64Convertor } from "../../utils/additionalFunction";

const PopupEdit = ({ isOpen, onClose, promotion }) => {
    const [formData, setFormData] = useState({
        type: "",
        file: null,
        productName: "",
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [base64File, setBase64File] = useState("");
    const [previewFile, setPreviewFile] = useState("");

    useEffect(() => {
        if (promotion) {
            setFormData({
                productName: promotion.productName || "",
                type: promotion.type || "",
                file: null,
            });
            setPreviewFile(promotion.link || "");
        }
    }, [promotion]);

    useEffect(() => {
        setIsFormValid(formData.productName && formData.type && (base64File || previewFile));
    }, [formData, base64File, previewFile]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const list = await getAllProductList();
                setData(list.map((item) => item.name));
            } catch (error) {
                console.error("Error fetching product list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            imageBase64Convertor(e, setBase64File, setPreviewFile);
            setFormData((prevData) => ({ ...prevData, file: e.target.files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData, file: base64File || previewFile, id: promotion._id };
            const response = await updatePromotion(payload, promotion._id);
            if (response) {
                Swal.fire({ icon: "success", title: "Updated Successfully!", text: "Promotion updated successfully!" }).then(() => {
                    window.location.reload();
                });
                onClose();
            } else {
                Swal.fire({ icon: "error", title: "Update Failed", text: response?.message || "Something went wrong. Please try again." });
            }
        } catch (error) {
            console.error("Error updating promotion:", error);
            Swal.fire({ icon: "error", title: "Error", text: "Failed to update promotion. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            {loading || submitting ? (
                <PageLoader />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-xl font-bold mb-4">Edit Promotion</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <SelectComponent label="Select Product Name" name="productName" value={formData.productName} onChange={handleChange} options={data.map((item) => ({ value: item, label: item }))} placeholder="Choose an option" />
                        <SelectComponent label="Select Media Type" name="type" value={formData.type} onChange={handleChange} options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }, { value: "pdf", label: "PDF" }]} placeholder="Choose an option" />
                        {formData.type && <InputField label={`Upload ${formData.type}`} name="file" type="file" onChange={handleChange} />}
                        {previewFile && (
                            <div className="w-full h-40 rounded-lg overflow-hidden mt-2">
                                {formData.type === "image" && <img src={previewFile} alt="Preview" className="w-full h-full object-cover" />}
                                {formData.type === "video" && <video controls className="w-full h-full object-cover"><source src={previewFile} type="video/mp4" /></video>}
                                {formData.type === "pdf" && <a href={previewFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <button type="submit" className={`py-2 text-sm px-4 rounded-md transition ${isFormValid ? "bg-blue-600 text-white" : "bg-gray-400 cursor-not-allowed"}`} disabled={!isFormValid}>{submitting ? "Updating..." : "Update"}</button>
                            <button type="button" className="bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-600" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PopupEdit;
