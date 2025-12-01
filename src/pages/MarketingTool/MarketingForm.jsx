import React, { useEffect, useState } from "react";
import SelectComponent from "../../components/SelectComponent";
import Select from "react-select";
import InputField from "../../components/InputField";
import { getAllProductList } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";
import Swal from "sweetalert2"; // Import SweetAlert
import { createPromotion } from "../../api/auth-api";

import { imageBase64Convertor } from "../../utils/additionalFunction";

const MarketingForm = () => {
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
    const [previewImg, setPreviewImg] = useState("");

    useEffect(() => {
        setIsFormValid(formData.productName && formData.type && base64File);
    }, [formData, base64File]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const list = await getAllProductList();
                setData(list.map((item) => item.brand).sort((a, b) => a.localeCompare(b)));
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
            imageBase64Convertor(e, setBase64File, setPreviewImg);
            setFormData((prevData) => ({ ...prevData, file: e.target.files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData, file: base64File };
            const response = await createPromotion(payload);

            if (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Form submitted successfully!",
                }).then(() => {
                    window.location.reload();
                });
                setFormData({ type: "", file: null, productName: "" });
                setBase64File("");
                setPreviewImg("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Submission Failed",
                    text: response?.message || "Something went wrong. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to submit form. Please try again.",
            });
        }
        finally {
            setSubmitting(false);
        }
    };


    return (
        <div>
            {(loading || submitting) ? (
                <PageLoader />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                            {/* <SelectComponent
                            label="Select Product Name"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            options={data.map((item) => ({ value: item, label: item }))}
                            placeholder="Choose an option"
                        /> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Product Name
                                </label>
                                <Select
                                    name="productName"
                                    value={formData.productName}
                                    onChange={(selectedOption) =>
                                        handleChange({ target: { name: "productName", value: selectedOption.value } })
                                    }
                                    options={data.map((item) => ({ value: item, label: item }))}
                                    placeholder="Choose an option"
                                    isSearchable
                                />
                            </div>

                        <SelectComponent
                            label="Select Media Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={[
                                { value: "image", label: "Image" },
                                { value: "video", label: "Video" },
                                { value: "pdf", label: "PDF" },
                            ]}
                            placeholder="Choose an option"
                        />

                        {formData.type && (
                            <InputField
                                label={`Upload ${formData.type}`}
                                name="file"
                                type="file"
                                onChange={handleChange}
                            />
                        )}
                    </div>

                    <div className="">
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded-md transition ${isFormValid
                                    ? "bg-bg-color text-white"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                            disabled={!isFormValid}
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MarketingForm;
