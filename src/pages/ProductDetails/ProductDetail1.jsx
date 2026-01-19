import React from "react";
import img from "../../assets/productlist/img.jpg";
import PageLoader from "../../components/ui/PageLoader";
import InputField from "../../components/InputField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

const ProductDetail1 = ({ productData }) => {
    console.log(productData);

    if (!productData) return <PageLoader />;

    const productImages = productData.images || [];

    return (
        <div className="bg-white rounded-xl space-y-7 p-4">
            <div className="flex justify-between items-center">
                <h1 className="md:text-2xl text-xl font-medium">
                    Product ID - {productData?.productId}{" "}
                    <span className="text-bg-color font-normal">
                        ({productData?.brand})
                    </span>
                </h1>
            </div>

            <form
                id="form"
                className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 bg-white p-4 rounded-lg shadow"
            >
                <InputField
                    label="Product:"
                    name="brand"
                    value={productData?.brand || ""}
                    disabled
                />
                <div>
                    <label className="block text-sm font-normal text-gray-700">
                        Product Name:
                    </label>
                    <textarea
                        name="combination"
                        value={productData?.combination || ""}
                        disabled
                        className="mt-1 block w-full text-xs bg-bg-color1/50 border-gray-300 rounded shadow-sm border p-3 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-normal text-gray-700">
                        Product Category:
                    </label>
                    <div className="mt-1 block w-full text-xs bg-bg-color1/50 border-gray-300 rounded shadow-sm border p-3 outline-none pr-10">
                        {productData?.category?.map((category) => (
                            <span
                                key={category._id}
                                className="mr-2 bg-gray-200 shadow-sm text-xs p-1 rounded-md w-fit"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>
                <InputField
                    label="Product License:"
                    name="type"
                    value={productData?.type?.name || ""}
                    disabled
                />
                <InputField
                    label="Product Dosage:"
                    name="variant"
                    value={productData.variant?.name || ""}
                    disabled
                />
                {/* <InputField
                    label="Product ID:"
                    name="productId"
                    value={productData.productId || ""}
                        disabled
                /> */}
                <InputField
                    label="Pack Type:"
                    name="pack_type"
                    value={productData.pack_size || ""}
                    disabled
                />
                <InputField
                    label="Pack Size:"
                    name="pack_size"
                    value={productData.pack_type || ""}
                    disabled
                />
                <InputField
                    label="MRP:"
                    name="price"
                    value={productData.price || ""}
                    disabled
                />
                <InputField
                    label="Franchisee Price:"
                    name="franchiseePrice"
                    value={productData.franchiseePrice || ""}
                    disabled
                />
                <InputField
                    label="Discount (%): (MRP & Franchisee Price difference)"
                    name="discountPercentage"
                    value={(((productData?.price - productData?.franchiseePrice) / productData?.price) * 100).toFixed(2) + '%' || 0}
                    disabled
                />
                <InputField
                    label="GST (%):"
                    name="gst"
                    value={productData.gstPercentage + '%' || ""}
                    disabled
                />
                <InputField
                        label="HSN Code:"
                        name="hsn"
                        value={productData.hsn || ""}
                        disabled
                />

            </form>

            <div className="space-y-6">
                <div className="">
                    <h2 className="text-base font-normal">
                        Detailed Description
                    </h2>
                    <ReactQuill
                        value={productData.description || ""}
                        readOnly={true}
                        theme="bubble" // Uses a minimal, non-editable theme
                        className="w-full border rounded p-2 mt-2 text-sm bg-bg-color1/20"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-base font-normal">Product Images</h2>
                <div className="grid xl:grid-cols-5 lg:px-20 md:px-16 sm:px-10 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 lg:gap-10 md:gap-8 gap-5 mt-4">
                    {productImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Product ${index + 1}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
                            }}
                            className="w-full h-40 object-cover rounded border"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail1;
