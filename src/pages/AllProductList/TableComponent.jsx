import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import SelectComponent from "../../components/SelectComponent";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import {
    deleteProduct,
    filterProducts,
    softHideProduct,
} from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";
import ProductForm from "../AddProductManagement/ProductForm";
import ProductDetail1 from "../ProductDetails/ProductDetail1";
import no_data_image from "../../assets/productlist/no_data.jpg";

const TableComponent = ({ tittle, data }) => {
    const [searchInput, setSearchInput] = useState("");
    const [selectedProduct, setSelectedProduct] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [loading, setLoading] = useState(false);
    const [showView, setShowView] = useState(false);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Generates last 10 years
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState({});
    const [searchfilteredProducts, setSearchFilteredProducts] = useState([]);
    const [showProductEditForm, setShowProductEditForm] = useState(false);

    useEffect(() => {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage)); // Restore page from localStorage
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        if (data && data.length) {
            setLoading(false);
            setSearchFilteredProducts(data);
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [data]);


    const handleReset = () => {
        setQuery({});
        setSearchFilteredProducts(data);
        query.date("");
    };

    const handleFilter = async () => {
        try {
            setLoading(true);
            await filterProducts(query.year, query.month, query.date).then(
                (res) => setSearchFilteredProducts(res?.products || [])
            );
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

    const handleEdit = (data) => {
        setShowProductEditForm(true);
        setSelectedProduct(data);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteProduct(id);
            Swal.fire({
                icon: "success",
                title: "Product Deleted!",
                text: "Product Deleted Successfully",
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

    const filteredData = searchfilteredProducts?.filter(
        (item) =>
            item?.category?.name
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item?.brand
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item?.combination?.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.productId?.toLowerCase().includes(searchInput.toLowerCase())
    );

    const totalPages = Math.ceil(data?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    console.log("hello", paginatedData);

    const handleSoftHide = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to hide this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    await softHideProduct(id);
                    Swal.fire({
                        title: "Success",
                        text: "Product is hidden successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(() => window.location.reload());
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text:
                            error?.response?.data?.message ||
                            "Something went wrong",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <>
            <div className="space-y-7">
                <div className="p-5 bg-white rounded-xl  overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-800">
                            {tittle}
                        </h2>
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
                        {searchfilteredProducts.length === 0 ? (
                            <img
                                src={no_data_image}
                                alt="data not found"
                                className="w-60 h-60 m-auto"
                            />
                        ) : (
                            <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                                <thead>
                                    <tr className="">
                                        <th className="border border-gray-300 p-2 font-medium">
                                            SL
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                            Image
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                                Brand
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                                Combination
                                            </th>
                                            <th className="border border-gray-300 p-2 font-medium">
                                            Category
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                            License
                                        </th>
                                            {/* <th className="border border-gray-300 p-2 font-medium">
                                            Product ID
                                        </th> */}
                                        <th className="border border-gray-300 p-2 font-medium">
                                            Dosage
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                                Pack Type
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                                Pack Size
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                            MRP (Rs)
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                            Franchisee Price (Rs)
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                                Discount Percentage (%)
                                            </th>
                                            <th className="border border-gray-300 p-2 font-medium">
                                            Action
                                        </th>
                                        <th className="border border-gray-300 p-2 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading
                                        ? paginatedData.map((_, index) => (
                                              <tr
                                                  key={index}
                                                  className="animate-pulse"
                                              >
                                                  <td className="p-2 text-center border border-gray-300">
                                                      <div className="h-8 w-6 bg-gray-300 rounded mx-auto"></div>
                                                  </td>
                                                  <td className="p-2 text-center border border-gray-300">
                                                      <div className="h-8 w-auto bg-gray-300 rounded mx-auto"></div>
                                                  </td>
                                                {/* <td className="p-2 text-center border border-gray-300">
                                                      <div className="h-8 bg-gray-300 rounded w-20 mx-auto"></div>
                                                  </td> */}
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
                                                      <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
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
                                                    <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
                                                </td>
                                                <td className="p-2 text-center border border-gray-300">
                                                      <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
                                                  </td>
                                              </tr>
                                          ))
                                        : paginatedData.map((item, index) => (
                                              <tr
                                                  key={index}
                                                className="hover:bg-gray-50 align-top"
                                              >
                                                  <td className="border border-gray-300 p-2">
                                                      {(currentPage - 1) *
                                                          rowsPerPage +
                                                          index +
                                                          1}
                                                  </td>
                                                  <td className="border border-gray-300 p-2">
                                                      <img
                                                        src={item?.images?.[0]}
                                                          alt={
                                                              item?.brand
                                                          }
                                                          className="w-auto h-8 object-cover rounded"
                                                      />
                                                  </td>
                                                  <td className="border border-gray-300 p-2 font-light">
                                                      {item?.brand}
                                                  </td>
                                                <td className="border border-gray-300 p-2 font-light">
                                                    <p className="text-xs">{item?.combination?.split(',').join(' | ')}</p>
                                                </td>
                                                  <td className="p-2 font-light grid gap-1">
                                                      {item?.category?.map(
                                                          (cat) => (
                                                              <span
                                                                  key={cat._id}
                                                                  className="bg-gray-200 text-xs p-1 rounded-md mr-1 w-fit"
                                                              >
                                                                  {cat.name}
                                                              </span>
                                                          )
                                                      )}
                                                  </td>
                                                  <td className="border border-gray-300 p-2 font-light">
                                                      {item?.type?.name}
                                                  </td>
                                                {/* <td className="border border-gray-300 p-2 font-light">
                                                      {item?.productId}
                                                  </td> */}
                                                  <td className="border border-gray-300 p-2 font-light">
                                                      {item?.variant?.name}
                                                  </td>
                                                  <td className="border border-gray-300 p-2 font-light">
                                                    {item?.pack_type}
                                                </td>
                                                <td className="border border-gray-300 p-2 font-light">
                                                    {item?.pack_size}
                                                  </td>
                                                  <td className="border border-gray-300 p-2 font-light">
                                                    ₹{item?.price}
                                                  </td>
                                                  <td className="border border-gray-300 p-2 font-light">
                                                    ₹{item?.franchiseePrice}
                                                  </td>
                                                <td className="border border-gray-300 p-2 font-light">
                                                    {(((item?.price - item?.franchiseePrice) / item?.price) * 100).toFixed(2) || 0}%
                                                </td>
                                                  <td className="p-2 border border-gray-300 text-center">
                                                      <div className="flex gap-2 items-center justify-center">
                                                          <button
                                                              className="p-2 rounded text-bg-color bg-bg-color/10"
                                                              onClick={() => {
                                                                  setShowView(
                                                                      true
                                                                  );
                                                                  setSelectedProduct(
                                                                      item
                                                                  );
                                                              }}
                                                          >
                                                              <FaRegEye />
                                                          </button>
                                                          <button
                                                              className="p-2 rounded text-bg-color bg-bg-color/10"
                                                              onClick={() =>
                                                                  handleEdit(
                                                                      item
                                                                  )
                                                              }
                                                          >
                                                              <MdModeEdit />
                                                          </button>
                                                          <button
                                                              className="p-2 rounded text-bg-color bg-bg-color/10"
                                                              onClick={() =>
                                                                  handleDelete(
                                                                      item._id
                                                                  )
                                                              }
                                                          >
                                                              <RiDeleteBin6Line />
                                                          </button>
                                                      </div>
                                                  </td>
                                                  <td className="border border-gray-300 p-2 font-light">
                                                      <button
                                                          className={`px-2 py-1 font-medium rounded ${
                                                              !item?.isDeleted
                                                                  ? "bg-red-400 text-white"
                                                                  : "bg-green-400 text-black"
                                                          }`}
                                                          onClick={() => {
                                                              handleSoftHide(
                                                                  item._id
                                                              );
                                                          }}
                                                      >
                                                          {item?.isDeleted
                                                              ? "Show"
                                                              : "Hide"}
                                                      </button>
                                                  </td>
                                              </tr>
                                          ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600">
                            Rows per page: {rowsPerPage}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                    localStorage.setItem('currentPage', currentPage);
                                }}
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                const shouldDisplay =
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 2 && page <= currentPage + 2);

                                if (!shouldDisplay) return null;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(page)
                                            localStorage.setItem('currentPage', currentPage);
                                        }}
                                        className={`px-2 py-1 mx-1 border rounded ${currentPage === page
                                            ? "bg-bg-color text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                    localStorage.setItem('currentPage', currentPage);
                                }}
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
                                <h2 className="text-xl font-medium">
                                    Edit Product
                                </h2>
                                <button
                                    className=" bg-red-500 w-10 h-10 rounded-full text-2xl text-white flex items-center justify-center"
                                    onClick={() => {
                                        setShowProductEditForm(false);
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                            <ProductForm
                                productData={selectedProduct}
                                isEditMode={true}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                            />
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
                                    onClick={() => {
                                        setShowView(false);
                                    }}
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
