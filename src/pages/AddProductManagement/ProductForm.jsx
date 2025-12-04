/* eslint-disable react/prop-types */
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import {
    addProductForm,
   
    getCategoryList,
   
    getVariantsList,
    updateProduct,
} from "../../api/product-management-api";
import Button from "../../components/Button";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import PageLoader from "../../components/ui/PageLoader";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdDeleteForever } from "react-icons/md";

const ProductForm = ({ productData = null, isEditMode = false, setCurrentPage, currentPage }) => {
    const initialState = {
        product_category: [],
        
        combination: "",
        product_variant: "",
        pack_type: "",
        pack_size: "",
        hsn: "",
        stock:"",
        gst_in_percentage: 0,
        product_mrp: 0,
        franchisee_price: 0,
        detail_description: "",
        images: [],
        productId: "",
    };
    const [errors, setErrors] = useState("");
    const [payload, setPayload] = useState({
        ...initialState, 
        images: productData?.images || [],
    });
    const [producttypeOptions, setProductTypeOptions] = useState([]);
   
    const [loading, setLoading] = useState(false);
    const [productVariant, setProductVariant] = useState([]);
    const [categories, setCategories] = useState([]);
    const [base64Images, setBase64Images] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [variants, categoryList] = await Promise.all([
                    getVariantsList(),
                    getCategoryList(),
                ]);
                setProductVariant(variants);
                console.log(categoryList)
                setCategories(categoryList);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load initial data",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (isEditMode && productData) {
            setPayload({
                product_category: productData?.category || "",
                
                product_variant: productData?.variant?._id || "",
                pack_type: productData?.pack_size || "",
                pack_size: productData?.pack_type || "",
                stock:productData?.stock||"",
                product_name: productData?.name || "",
                product_mrp: productData?.price || 0,
                franchisee_price: productData?.franchiseePrice || 0,
                discount: productData?.discount || "",
                gst_in_percentage: productData?.gstPercentage || 0,
                detail_description: productData?.description || "",
                images: productData?.images || [],
                hsn: productData?.hsn || "",
                combination: productData?.combination || "",
                productId: productData?.productId || "",
            });
        }
    }, [isEditMode, productData]);


    useEffect(() => {
        const fetchProductTypes = async () => {
            if (payload.product_category) {
                try {
                    const types = await getProductTypeList(
                        payload.product_category
                    );
                    setProductTypeOptions(types);
                } catch (error) {
                    console.error("Error fetching product types:", error);
                }
            }
        };

        fetchProductTypes();
    }, []);


    const handleImageChange = async (event) => {
        const files = Array.from(event.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB

        try {
            const validFiles = files.filter((file) => {
                if (file.size > maxSize) {
                    Swal.fire({
                        icon: "error",
                        title: "File too large",
                        text: `${file.name} exceeds 5MB limit`,
                    });
                    return false;
                }
                return true;
            });

            const base64Array = await Promise.all(
                validFiles.map((file) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = () => resolve(reader.result);
                    });
                })
            );

            setBase64Images((prev) => [...prev, ...base64Array]);
        } catch (error) {
            console.error("Error processing images:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to process images",
            });
        }
    };

    const removePayloadImage = (index) => {
        setPayload((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const removeBase64Image = (index) => {
        setBase64Images((prev) => prev.filter((_, i) => i !== index));
    };

    const validateFields = () => {
        let tempErrors = {};

        if (!payload.product_category || payload.product_category.length === 0)
            tempErrors.product_category = "Product Category is required!";
        
        if (!payload.product_variant) {
            tempErrors.product_variant = "Product Dosage is required!";
            console.log(tempErrors.product_variant)
        }
        if (!payload.combination)
            tempErrors.combination = "Product Combination is required!";
        if (!payload.pack_type) tempErrors.pack_type = "Pack Type is required!";
         if (!payload.stock) tempErrors.stock = "Pack Type is required!";
        if (!payload.pack_size) tempErrors.pack_size = "Pack Size is required!";
        if (!payload.product_mrp || payload.product_mrp <= 0) {
            tempErrors.product_mrp = "Valid MRP is required!";
        }
        if (!payload.franchisee_price || payload.franchisee_price <= 0) {
            tempErrors.franchisee_price = "Valid Franchisee Price is required!";
        }
        if (!payload.gst_in_percentage) {
            tempErrors.gst_in_percentage = "GST percentage is required!";
        }
        if (!payload.detail_description) {
            tempErrors.detail_description = "Product Description is required!";
        }
        if (!payload.hsn) {
            tempErrors.hsn = "HSN Code is required!";
        }
        console.log(tempErrors);
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        console.log(payload);
        if (!validateFields()) return;

        try {
            setLoading(true);
            const finalPayload = {
                ...payload,
                images: [...payload.images, ...base64Images],
            };

            if (isEditMode) {
                await updateProduct(productData._id, finalPayload);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Product updated successfully",
                }).then(() => {
                    setCurrentPage(currentPage);
                    window.location.reload();
                });
            } else {
                await addProductForm(finalPayload);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Product added successfully",
                }).then(() => window.location.reload());
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPayload(initialState);
        setBase64Images([]);
        setProductTypeOptions([]);
    };

    useEffect(() => {
        if (productData?.images) {
            setPayload((prev) => ({ ...prev, images: productData.images }));
        }
    }, [productData]);

    console.log(categories)

    // console.log("productData", categories);
    const options =
        categories?.categories?.map((category) => ({
            value: category._id,
            label: category.name,
        })) || [];

    return (
        <>
            {loading && <PageLoader />}
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                   
                    <InputField
                        label="Product ID"
                        name=""
                        value={payload.productId}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                productId: e.target.value,
                            })
                        }
                        placeholder=""
                        type="text"
                        error={errors.productId && errors.productId}
                    />
                    <div>
                        <label className="text-sm font-normal">
                            Select License
                        </label>
                        <select
                            name=""
                            id=""
                            className="p-3 border text-xs bg-bg-color1/50 border-gray-300 rounded-md outline-none w-full"
                            value={payload.product_type}
                            onChange={(e) =>
                                setPayload({
                                    ...payload,
                                    product_type: e.target.value,
                                })
                            }
                        >
                            <option value="" selected>
                                Select License
                            </option>
                            {producttypeOptions?.map((el) => (
                                <option key={el._id} value={el._id}>
                                    {el.name}
                                </option>
                            ))}
                        </select>
                        {errors.product_type && (
                            <p className="text-red-500 text-sm">
                                {errors.product_type}
                            </p>
                        )}
                    </div>
                    <InputField
                        label="Enter Combination"
                        name=""
                        value={payload.combination}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                combination: e.target.value,
                            })
                        }
                        placeholder=""
                        type="text"
                        error={errors.combination && errors.combination}
                    />
                    <div>
                        <label className="text-sm font-normal">
                            Select Dosage Form
                        </label>
                        <select
                            name=""
                            id=""
                            className="p-3 border text-xs bg-bg-color1/50 border-gray-300 rounded-md outline-none w-full"
                            value={payload.product_variant}
                            onChange={(e) =>
                                setPayload({
                                    ...payload,
                                    product_variant: e.target.value,
                                })
                            }
                        >
                            <option value="" selected>
                                Select Dosage Form
                            </option>
                            {productVariant?.map((el, i) => (
                                <option key={i} value={el._id}>
                                    {el.name}
                                </option>
                            ))}
                        </select>
                        {errors.product_variant && (
                            <p className="text-red-500 text-sm">
                                {errors.product_variant}
                            </p>
                        )}
                    </div>

                    <InputField
                        label="Enter Pack Type"
                        name=""
                        value={payload.pack_type}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                pack_type: e.target.value,
                            })
                        }
                        placeholder=""
                        type="text"
                        error={errors.pack_type && errors.pack_type}
                    />
                    <InputField
                        label="Enter stock"
                        name=""
                        value={payload.stock}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                stock: e.target.value,
                            })
                        }
                        placeholder=""
                        type="number"
                        error={errors.stock && errors.stock}
                    />
                    <InputField
                        label="Enter Pack Size"
                        name=""
                        value={payload.pack_size}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                pack_size: e.target.value,
                            })
                        }
                        placeholder=""
                        type="text"
                        error={errors.pack_size && errors.pack_size}
                    />
                    <InputField
                        label="HSN Code"
                        name=""
                        value={payload.hsn}
                        onChange={(e) =>
                            setPayload({ ...payload, hsn: e.target.value })
                        }
                        placeholder=""
                        type="text"
                        error={errors.hsn && errors.hsn}
                    />
                    <InputField
                        label="GST in Percentage"
                        name=""
                        value={payload.gst_in_percentage}
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                gst_in_percentage: e.target.value,
                            })
                        }
                        placeholder=""
                        type="number"
                        error={
                            errors.gst_in_percentage && errors.gst_in_percentage
                        }
                    />
                    <InputField
                        label="Product MRP"
                        name=""
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                product_mrp: e.target.value,
                            })
                        }
                        value={payload.product_mrp}
                        placeholder=""
                        type="number"
                        error={errors.product_mrp && errors.product_mrp}
                    />
                    <InputField
                        label="Franchisee Price"
                        name=""
                        onChange={(e) =>
                            setPayload({
                                ...payload,
                                franchisee_price: e.target.value,
                            })
                        }
                        value={payload.franchisee_price}
                        placeholder=""
                        type="number"
                        error={
                            errors.franchisee_price && errors.franchisee_price
                        }
                    />
                    <div className="lg:col-span-3 md:col-span-2 col-span-1">
                        <label className="block text-sm font-normal text-gray-700">
                            Select Product Category
                        </label>
                        <Select
                            options={options}
                            isMulti
                            styles={{
                                control: (styles) => ({
                                    ...styles,
                                    backgroundColor: "#f7f7f7",
                                    border: "1px solid #d1d5da",
                                    fontSize: "0.875rem",
                                    marginTop: "0.25rem",
                                    color: "#111827",
                                    fontWeight: 400,
                                    padding: "0.1rem",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#d1d5da",
                                    },
                                }),
                            }}
                            onChange={(selected) => {
                                setPayload({
                                    ...payload,
                                    product_category: selected.map(
                                        (item) => item.value
                                    ), // Store array of selected values
                                });
                            }}
                        />
                        {errors.product_category && (
                            <p className="text-red-500 text-sm">
                                {errors.product_category}
                            </p>
                        )}
                        {payload?.product_category?.length > 0 && (
                            <div className="mt-2">
                                <h3 className="text-sm font-semibold">
                                    Selected Categories:
                                </h3>
                                <ul className="list-disc pl-5 flex gap-2 mt-2">
                                    {payload?.product_category?.map((cat, index) => (
                                        console.log(cat),
                                        <li key={index} className="text-sm px-2 py-1 flex items-center gap-2 bg-gray-200 w-fit rounded-md">
                                            {cat?.name}
                                            <button
                                                className="text-red-500 text-base"
                                                onClick={() => {
                                                    setPayload((prev) => ({
                                                        ...prev,
                                                        product_category: prev.product_category.filter(
                                                            (item) =>
                                                                item !== cat
                                                        ),
                                                    }));
                                                }}
                                            >
                                                <MdDeleteForever />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="Detailed Description">
                        Detailed Description
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={payload.detail_description}
                        onChange={(value) =>
                            setPayload({
                                ...payload,
                                detail_description: value,
                            })
                        }
                        placeholder="Organize your data in familiar spreadsheets and workbooks..."
                        className="bg-bg-color1/50 border-gray-300 rounded "
                    />
                    {errors.detail_description && (
                        <p className="text-red-500 text-sm">
                            {errors.detail_description}
                        </p>
                    )}
                </div>

                <div className="col-span-full">
                    <h2 className="text-base mb-4">Product Images</h2>
                    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:grid-cols-6 gap-5">
                        {payload.images.map((img, index) => (
                            <div key={index} className="relative w-full h-40">
                                <img
                                    src={img}
                                    alt={`Preview ${index}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
                                    }}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removePayloadImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {base64Images.map((base64, index) => (
                            <div key={index} className="relative w-full h-40">
                                <img
                                    src={base64}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removeBase64Image(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        <div
                            className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="text-center">
                                <IoMdAdd className="mx-auto text-2xl text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    Add Images
                                </p>
                            </div>
                        </div>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    {errors.images && (
                        <p className="text-red-500 text-sm">{errors.images}</p>
                    )}
                </div>

                <div>
                    <div className="flex gap-4 mt-20  items-center justify-center">
                        <Button
                            title={
                                isEditMode ? "Update Product" : "Add Product"
                            }
                            onClick={handleSubmit}
                            disabled={loading}
                        />
                        <Button
                            bgcolor={"bg-[#FF5F5F]"}
                            title="Reset"
                            onClick={handleReset}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductForm;
