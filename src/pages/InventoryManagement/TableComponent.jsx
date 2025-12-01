/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { deleteProduct } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";
import ProductForm from "../AddProductManagement/ProductForm";
import ProductDetail1 from "../ProductDetails/ProductDetail1";

const TableComponent = ({ title, data }) => {
    const [searchInput, setSearchInput] = useState("");
    const [selectedProduct, setSelectedProduct] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [loading, setLoading] = useState(false)
    const [showView, setShowView] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (data && data.length) {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [data]);

    // console.log(isLoading);


    const [showProductEditForm, setShowProductEditForm] = useState(false)

    const handleEdit = (data) => {
        setShowProductEditForm(true)
        setSelectedProduct(data)
    }

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteProduct(id)
            Swal.fire({
                icon: "success",
                title: "Product Deleted!",
                text: "Product Deleted Successfully",
            }).then(() => (
                window.location.reload()

            ))

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
    }

    const filteredData = data.filter(
        (item) =>
            item?.category?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.brand?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.productId.toLowerCase().includes(searchInput.toLowerCase())
    );

    // console.log(filteredData);
    

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);


    return (
        <>
            {loading && <PageLoader />}
            <div className="">
                <div className="p-5 bg-white rounded-xl  overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-800">{title}</h2>
                        {/* <Button title={'Refer Product'} icon={<MdAddCircleOutline />} /> */}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by Category, Product Name, or Product ID"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md outline-none text-sm"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                            <thead>
                                <tr className="">
                                    <th className="border border-gray-300 p-2 font-medium">SL</th>
                                    <th className="border border-gray-300 p-2 font-medium">Image</th>
                                    <th className="border border-gray-300 p-2 font-medium">Category</th>
                                    <th className="border border-gray-300 p-2 font-medium">Type</th>
                                    <th className="border border-gray-300 p-2 font-medium">Brand</th>
                                    <th className="border border-gray-300 p-2 font-medium">Product Name</th>
                                    <th className="border border-gray-300 p-2 font-medium">Product ID</th>
                                    <th className="border border-gray-300 p-2 font-medium">Unit</th>
                                    <th className="border border-gray-300 p-2 font-medium">Variant</th>
                                    <th className="border border-gray-300 p-2 font-medium">Price (Rs)</th>
                                    <th className="border border-gray-300 p-2 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    paginatedData?.map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 w-6 bg-gray-300 rounded mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 w-auto bg-gray-300 rounded mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-20 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-20 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-32 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                            <td className="p-2 text-center border border-gray-300">
                                                <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    paginatedData?.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-2">
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.productName}
                                                    className="w-auto h-10 object-cover rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.category?.name}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.type?.name}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.brand?.name}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.name}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.productId}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.stock}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.variantType}</td>
                                            <td className="border border-gray-300 p-2 font-light">{item?.price}</td>
                                            <td className="p-2 border border-gray-300 text-center">
                                                <div className="flex gap-2 items-center justify-center">
                                                    <button className="p-2 rounded text-bg-color bg-bg-color/10" onClick={() => { setShowView(true); setSelectedProduct(item); }}>
                                                        <FaRegEye />
                                                    </button>
                                                    <button className="p-2 rounded text-bg-color bg-bg-color/10" onClick={() => { handleEdit(item); }}>
                                                        <MdModeEdit />
                                                    </button>
                                                    <button className="p-2 rounded text-bg-color bg-bg-color/10" onClick={() => handleDelete(item._id)}>
                                                        <RiDeleteBin6Line />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600">
                            Rows per page: {rowsPerPage}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-2 py-1 border rounded ${currentPage === i + 1 ? "bg-bg-color text-white" : "hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showProductEditForm && (
                <div className="fixed inset-0 bg-black/50 h-screen flex items-center justify-center z-[999999999]  left-0">
                    <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg  space-y-4 p-4 max-h-[80vh] overflow-y-auto">
                        <div className="">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">Edit Product</h2>
                                <button
                                    className=" bg-red-500 w-10 h-10 rounded-full text-2xl text-white flex items-center justify-center"
                                    onClick={() => { setShowProductEditForm(false); }}
                                >
                                    &times;
                                </button>
                            </div>

                            <ProductForm productData={selectedProduct} isEditMode={true} />
                        </div>
                    </div>
                </div>
            )}

            {showView && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="lg:w-[80%] w-[95%] bg-white rounded-xl shadow-lg  space-y-4  p-4 max-h-[80vh] overflow-y-auto">
                        <div className="">
                            <div className="flex justify-between items-center">
                                <button
                                    className=" bg-red-500 w-10 text-white text-3xl h-10 rounded-full flex items-center justify-center"
                                    onClick={() => { setShowView(false); }}
                                >
                                    <p>&times;</p>
                                </button>
                            </div>
                            <ProductDetail1 productData={selectedProduct} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TableComponent;

