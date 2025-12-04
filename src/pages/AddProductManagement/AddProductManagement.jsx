import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddCategories from "./AddCategories";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

import {
   
    addProductType,
    addVariant,
    deleteCategoryType,
    deleteVariant,
    editVariant,
   
    getCategoryList,
   
    getVariantsList,
} from "../../api/product-management-api";
import Swal from "sweetalert2";
import InputField from "../../components/InputField";
import { imageBase64Convertor } from "../../utils/additionalFunction";
import ProductForm from "./ProductForm";
import Button from "../../components/Button";
import PageLoader from "../../components/ui/PageLoader";

const tabs = [
    "Add Product",
    "Add Category",
   
    "Add Dosage",
];

export default function AddProductManagement() {
    const [activeTab, setActiveTab] = useState(
        Number(localStorage.getItem("activeTab")) || 0
    );
    const [categories, setCategories] = useState([]);
    
    const [types, setTypes] = useState([]);
    const [producttype, setProductType] = useState("");
    const [brandInput, setBrandInput] = useState("");
    const [producttypeOptions, setProductTypeOptions] = useState([]);
    const [image, setImage] = useState("");
    const [productVariantInput, setProductVariantInput] = useState("");
    const [productVariant, setProductVariant] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [selectCategory, setSelectCategory] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    const fetchFuncHandler = async (func, setState) => {
        try {
            setLoading(true);
            const res = await func();
            setState(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFuncHandler(getVariantsList, setProductVariant);
        fetchFuncHandler(getCategoryList, setCategories);
        
        
    }, []);

    const ProductTypevalidateFields = () => {
        if (producttype === "") {
            Swal.fire({
                title: "Error",
                text: "Product type is required!",
                icon: "error",
                confirmButtonText: "OK",
            });
            return false;
        }

        return true;
    };
    const payload = {
        name: producttype,
    };

    const handleAddVariant = async () => {
        try {
            setLoading(true);
            await addVariant({ name: productVariantInput });
            Swal.fire({
                icon: "success",
                title: "Dosage Added!",
                text: "Dosage Successfully",
                timer: 3000,
            }).then(() => window.location.reload());
            setProductVariantInput("");
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

    const handleEditVariant = async (id) => {
        try {
            setLoading(true);
            await editVariant(id, { name: productVariantInput });
            Swal.fire({
                icon: "success",
                title: "Dosage Edited!",
                text: "Dosage Edit Successfully",
                timer: 3000,
            }).then(() => window.location.reload());
            setProductVariantInput("");
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!ProductTypevalidateFields()) return;
        try {
            setLoading(true);
            await addProductType(payload);
            Swal.fire({
                icon: "success",
                title: "Product type Added!",
                text: "Product type Successfully",
            }).then(() => {
                setProductType("");
            });
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

    
    //     if (brandInput === "") {
    //         Swal.fire({
    //             title: "Error",
    //             text: "Brand type is required!",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return false;
    //     }

    //     if (image === "") {
    //         Swal.fire({
    //             title: "Error",
    //             text: "brand image is required!",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return false;
    //     }

    //     return true;
    // };
    // const Brandpayload = {
    //     name: brandInput,
    //     image: image,
    // };

    // const handleBrandSave = async () => {
    //     if (!BrandvalidateFields()) return;
    //     try {
    //         setLoading(true);
    //         await addNewBrand(Brandpayload);
    //         Swal.fire({
    //             icon: "success",
    //             title: "New Brand Added!",
    //             text: "New Brand Successfully",
    //         }).then(() => {
    //             setBrandInput("");
    //             setImage("");
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: error?.response?.data?.message || "Something went wrong",
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteCategoryType(id);
            Swal.fire({
                icon: "success",
                title: "Category Deleted!",
                text: "Category Deleted Successfully",
            }).then(() => window.location.reload());
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVariant = async (id) => {
        try {
            setLoading(true);
            await deleteVariant(id);
            Swal.fire({
                icon: "success",
                title: "Dosage Deleted!",
                text: "Dosage Deleted Successfully",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <PageLoader />}
            <div className="p-5 bg-[#702F8A12] flex flex-col rounded-xl space-y-5 ">
                <h1 className="lg:text-xl md:text-lg text-sm font-medium">
                    Add Products - Category / License / Brand / Name
                </h1>

                <div className="flex border-b  bg-bg-color1 p-4 rounded-lg w-full whitespace-nowrap overflow-y-auto ">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`relative flex-1 p-3 px-8 text-center font-medium md:text-sm text-xs transition duration-300 ${
                                activeTab === index
                                    ? "text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            {activeTab === index && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-[#702F8A] rounded-lg"
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-bg-color1 p-6 rounded-lg w-full">
                    {activeTab === 1 && (
                        <motion.div
                            key="product-category"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <AddCategories />
                                <hr className="mt-4" />
                                <div className="mt-6">
                                    <h2 className="font-semibold mb-2">
                                        Created Product Category
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(categories) && categories.map((category, index)  => (
                                            <div
                                                key={index}
                                                className="px-3 py-1 bg-white text-[#616161] border rounded-md flex gap-2 items-center justify-center"
                                            >
                                                <span key={index}>
                                                    {category.name}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setShowEditForm(
                                                            !showEditForm
                                                        ),
                                                            setSelectedCategory(
                                                                category
                                                            );
                                                    }}
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            category._id
                                                        )
                                                    }
                                                >
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showEditForm && (
                                <div className="fixed inset-0 bg-black/50 h-screen flex items-center justify-center z-[999999999]  left-0">
                                    <div className="lg:w-[50%] w-[95%] bg-white rounded-xl shadow-lg  space-y-4 p-4 max-h-[80vh] overflow-y-auto">
                                        <div className="">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-xl font-medium">
                                                    Edit Category
                                                </h2>
                                                <button
                                                    className=" bg-red-500 w-10 h-10 rounded-full text-2xl text-white flex items-center justify-center"
                                                    onClick={() => {
                                                        setShowEditForm(false);
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>

                                            <AddCategories
                                                editMode={true}
                                                selectedCategory={
                                                    selectedCategory
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 2 && (
                        <motion.div
                            key="product-type"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-wrap gap-4 items-center justify-between">
                                <div className="grid md:grid-cols-2 gap-4 md:w-1/2 grid-cols-1">
                                    <div>
                                        <InputField
                                            label={"Product License"}
                                            onChange={(e) =>
                                                setProductType(e.target.value)
                                            }
                                            type="text"
                                            placeholder="Enter Product License"
                                            value={producttype}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex gap-3 col-span-2">
                                        {/* <Button onClick={resetType} bgcolor={"bg-blue-500"} title={"Cancel"} /> */}
                                        <Button
                                            onClick={(event) =>
                                                handleSubmit(event)
                                            }
                                            bgcolor={"bg-[#32C98D]"}
                                            title={"Add License"}
                                        />
                                    </div>
                                </div>
                                <hr className="mt-4" />
                                <div className="mt-6">
                                    <h2 className="font-semibold mb-2">
                                        Created Licenses
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {types?.map((types, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-white text-[#616161] border rounded-md"
                                            >
                                                {types.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 3 && (
                        <motion.div
                            key="brand"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <div>
                                        <InputField
                                            label={"Product Brand"}
                                            onChange={(e) =>
                                                setBrandInput(e.target.value)
                                            }
                                            type="text"
                                            placeholder={"Enter Product Brand"}
                                            value={brandInput}
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            type="file"
                                            label={"Brand Image"}
                                            onChange={(e) =>
                                                imageBase64Convertor(
                                                    e,
                                                    (imageBase64) =>
                                                        setImage({
                                                            image: imageBase64,
                                                        })
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Cancel</button>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleBrandSave}>
                        Save
                      </button> */}
                                    {/* <Button bgcolor={"bg-blue-500"} title={"Cancel"} /> */}
                                    <Button
                                        onClick={handleBrandSave}
                                        bgcolor={"bg-[#32C98D]"}
                                        title={"Add Brand"}
                                    />
                                </div>

                                <hr className="mt-4" />
                                <div className="mt-6">
                                    <h2 className="font-semibold mb-2">
                                        Created Brand names
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {brands?.map((brand, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-white text-[#616161] border rounded-md"
                                            >
                                                {brand.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 4 && (
                        <motion.div
                            key="product-dosage"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <div className="space-y-3 flex flex-col items-start">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        <InputField
                                            label="Product Dosage"
                                            value={productVariantInput}
                                            onChange={(e) =>
                                                setProductVariantInput(
                                                    e.target.value
                                                )
                                            }
                                            placeholder=""
                                            type="text"
                                        />
                                    </div>
                                    <Button
                                        bgcolor={"bg-[#32C98D]"}
                                        title="Add Dosage"
                                        onClick={handleAddVariant}
                                    />
                                </div>

                                <hr className="mt-4" />
                                <div className="mt-6">
                                    <h2 className="font-semibold mb-2">
                                        Created Product Dosages
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {productVariant?.map(
                                            (category, index) => (
                                                <div
                                                    key={index}
                                                    className="px-3 py-1 bg-white text-[#616161] border rounded-md flex justify-center items-center gap-2"
                                                >
                                                    <span key={index}>
                                                        {category.name}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            setShowEditForm(
                                                                !showEditForm
                                                            ),
                                                                setProductVariantInput(
                                                                    category.name
                                                                ),
                                                                setSelectedCategory(
                                                                    category
                                                                );
                                                        }}
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteVariant(
                                                                category._id
                                                            )
                                                        }
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {showEditForm && (
                                <div className="fixed inset-0 bg-black/50 h-screen flex items-center justify-center z-[999999999]  left-0">
                                    <div className="lg:w-[50%] w-[95%] bg-white rounded-xl shadow-lg  space-y-4 p-4 max-h-[80vh] overflow-y-auto">
                                        <div className="">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-xl font-medium">
                                                    Edit Dosage
                                                </h2>
                                                <button
                                                    className=" bg-red-500 w-10 h-10 rounded-full text-2xl text-white flex items-center justify-center"
                                                    onClick={() => {
                                                        setShowEditForm(false);
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>

                                            <div className="space-y-3 flex flex-col items-start">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                    <InputField
                                                        label="Product Dosage"
                                                        value={
                                                            productVariantInput
                                                        }
                                                        onChange={(e) =>
                                                            setProductVariantInput(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <Button
                                                    bgcolor={"bg-[#32C98D]"}
                                                    title="Edit Dosage"
                                                    onClick={() =>
                                                        handleEditVariant(
                                                            selectedCategory._id
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 0 && (
                        <motion.div
                            key="Product"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductForm />
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
