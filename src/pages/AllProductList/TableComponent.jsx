// src/pages/products/TableComponent.jsx
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
  // make sure getAllAttributes is exported from your API helper
} from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";
import ProductForm from "../AddProductManagement/ProductForm";
import ProductDetail1 from "../ProductDetails/ProductDetail1";
import no_data_image from "../../assets/productlist/no_data.jpg";
import { getAllAttributes } from "../../api/product-management-api"; // adjust path if needed

const TableComponent = ({ tittle, data = [] }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [showView, setShowView] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState({});
  const [searchfilteredProducts, setSearchFilteredProducts] = useState([]);
  const [showProductEditForm, setShowProductEditForm] = useState(false);
  const [attributeMap, setAttributeMap] = useState({}); // id -> name map

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
  }, []);

  // load attributes map once so we can resolve parent names
  useEffect(() => {
    const loadAttrs = async () => {
      try {
        const attrs = await getAllAttributes();
        const arr = Array.isArray(attrs) ? attrs : [];
        const map = {};
        arr.forEach((a) => {
          if (a && a._id) map[a._id] = a.name || "";
        });
        setAttributeMap(map);
      } catch (err) {
        console.error("Failed to load attributes:", err);
      }
    };
    loadAttrs();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (data && data.length) {
      setSearchFilteredProducts(data);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setSearchFilteredProducts([]);
      setIsLoading(false);
      setLoading(false);
    }
  }, [data]);

  const handleReset = () => {
    setQuery({});
    setSearchFilteredProducts(data);
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const res = await filterProducts(query.year, query.month, query.date);
      setSearchFilteredProducts(res?.products || []);
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

  const handleEdit = (item) => {
    setSelectedProduct(item);
    setShowProductEditForm(true);
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

  const filteredData = (searchfilteredProducts || []).filter((item) => {
    const category = (item?.product_category?.map((c) => c.name).join(" ") || "").toLowerCase();
    const brand = (item?.brand || "").toLowerCase();
    const combination = (item?.combination || "").toLowerCase();
    const productId = (item?.productId || "").toLowerCase();
    const search = (searchInput || "").toLowerCase();

    return (
      category.includes(search) ||
      brand.includes(search) ||
      combination.includes(search) ||
      productId.includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

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
            text: error?.response?.data?.message || "Something went wrong",
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
        <div className="p-5 bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">{tittle}</h2>
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
              <img src={no_data_image} alt="data not found" className="w-60 h-60 m-auto" />
            ) : (
              <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 font-medium">SL</th>
                    <th className="border border-gray-300 p-2 font-medium">Image</th>
                    <th className="border border-gray-300 p-2 font-medium">Combination</th>
                    <th className="border border-gray-300 p-2 font-medium">Category</th>
                    <th className="border border-gray-300 p-2 font-medium">Stock</th>
                    <th className="border border-gray-300 p-2 font-medium">Attributes</th>
                   
                    <th className="border border-gray-300 p-2 font-medium">Pack Size</th>
                    <th className="border border-gray-300 p-2 font-medium">MRP (Rs)</th>
                    <th className="border border-gray-300 p-2 font-medium">Vendor Price (Rs)</th>
                    <th className="border border-gray-300 p-2 font-medium">Discount Percentage (%)</th>
                    <th className="border border-gray-300 p-2 font-medium">Action</th>
                    <th className="border border-gray-300 p-2 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading
                    ? Array.from({ length: rowsPerPage }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="border border-gray-300 p-2">&nbsp;</td>
                          <td className="border border-gray-300 p-2">&nbsp;</td>
                          <td className="border border-gray-300 p-2">&nbsp;</td>
                          <td className="border border-gray-300 p-2">&nbsp;</td>
                          <td className="border border-gray-300 p-2">&nbsp;</td>
                          <td className="border border-gray-300 p-2">&nbsp;</td>
                        </tr>
                      ))
                    : paginatedData.map((item, index) => (
                        <tr key={item._id || index} className="hover:bg-gray-50 align-top">
                          <td className="border border-gray-300 p-2">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </td>

                          <td className="border border-gray-300 p-2">
                            <img
  src={
    item.images && item.images.length > 0
      ? typeof item.images[0] === "string"
        ? item.images[0]              // old data
        : item.images[0].url          // new data
      : "https://ik.imagekit.io/ynpnes3kr/products/1764729443583_09bb569962727d1b18ffe061c399c85a42b16169_QqdeYWEsY.png"
  }
  alt="product"
  className="w-auto h-8 object-cover rounded"
/>

                          </td>

                          <td className="border border-gray-300 p-2 font-light">
                            <p className="text-xs">{item?.combination?.split(",").join(" | ")}</p>
                          </td>

                          <td className="p-2 font-light grid gap-1">
                            {item?.product_category?.map((cat) => (
                              <span key={cat._id} className="bg-gray-200 text-xs p-1 rounded-md mr-1 w-fit">
                                {cat.name}
                              </span>
                            ))}
                          </td>

                          <td className="border border-gray-300 p-2 font-light">{item?.stock}</td>

                          {/* ATTRIBUTES: show Parent: values */}
                          <td className="border border-gray-300 p-2 font-light">
                            {item?.attributes && item.attributes.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {item.attributes.map((attr, ai) => {
                                  // attr.attribute may be populated object, id, or attr.parentName may exist
                                  let parentName = "";
                                  if (typeof attr.attribute === "object" && attr.attribute?.name) parentName = attr.attribute.name;
                                  else if (attr.parentName) parentName = attr.parentName;
                                  else if (typeof attr.attribute === "string") parentName = attributeMap[attr.attribute] || attr.attribute;
                                  const values = Array.isArray(attr.values) ? attr.values.join(", ") : "";
                                  return (
                                    <div key={`${attr.attribute}-${ai}`} className="text-xs">
                                      <strong>{parentName || "—"}:</strong> {values || "—"}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>

                         
                          <td className="border border-gray-300 p-2 font-light">{item?.pack_size}</td>

                          <td className="border border-gray-300 p-2 font-light">₹{item?.product_mrp}</td>

                          <td className="border border-gray-300 p-2 font-light">₹{item?.franchisee_price}</td>

                          <td className="border border-gray-300 p-2 font-light">
                            {item?.product_mrp
                              ? (((item?.product_mrp - (item?.franchisee_price || 0)) / item?.product_mrp) * 100).toFixed(2)
                              : "0.00"}
                            %
                          </td>

                          <td className="p-2 border border-gray-300 text-center">
                            <div className="flex gap-2 items-center justify-center">
                              <button
                                className="p-2 rounded text-bg-color bg-bg-color/10"
                                onClick={() => {
                                  setShowView(true);
                                  setSelectedProduct(item);
                                }}
                              >
                                <FaRegEye />
                              </button>

                              <button className="p-2 rounded text-bg-color bg-bg-color/10" onClick={() => handleEdit(item)}>
                                <MdModeEdit />
                              </button>

                              <button className="p-2 rounded text-bg-color bg-bg-color/10" onClick={() => handleDelete(item._id)}>
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          </td>

                          <td className="border border-gray-300 p-2 font-light">
                            <button
                              className={`px-2 py-1 font-medium rounded ${!item?.isDeleted ? "bg-red-400 text-white" : "bg-green-400 text-black"}`}
                              onClick={() => handleSoftHide(item._id)}
                            >
                              {item?.isDeleted ? "Show" : "Hide"}
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showView && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-2 right-2 text-gray-500 text-xl font-bold" onClick={() => setShowView(false)}>
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Product Details</h2>

            <div className="space-y-2">
              <p>
                <strong>Product ID:</strong> {selectedProduct.productId}
              </p>
              <p>
                <strong>Combination:</strong> {selectedProduct.combination?.split(",").join(" | ")}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.product_category?.map((cat) => cat.name).join(", ")}
              </p>
              <p>
                <strong>Stock:</strong> {selectedProduct.stock ?? "-"}
              </p>

              
              <p>
                <strong>Pack Size:</strong> {selectedProduct.pack_size || "-"}
              </p>

              <p>
                <strong>MRP:</strong> ₹{selectedProduct.product_mrp || "-"}
              </p>
              <p>
                <strong>Franchisee Price:</strong> ₹{selectedProduct.franchisee_price || "-"}
              </p>
              <p>
                <strong>Discount %:</strong>{" "}
                {selectedProduct.product_mrp && selectedProduct.franchisee_price
                  ? (((selectedProduct.product_mrp - selectedProduct.franchisee_price) / selectedProduct.product_mrp) * 100).toFixed(2)
                  : "0"}
                %
              </p>

              {/* Attributes */}
              <div>
                <strong>Attributes:</strong>
                {selectedProduct.attributes && selectedProduct.attributes.length > 0 ? (
                  <div className="mt-2 grid gap-1">
                    {selectedProduct.attributes.map((attr, i) => {
                      let parentName = "";
                      if (typeof attr.attribute === "object" && attr.attribute?.name) parentName = attr.attribute.name;
                      else if (attr.parentName) parentName = attr.parentName;
                      else if (typeof attr.attribute === "string") parentName = attributeMap[attr.attribute] || attr.attribute;
                      const values = Array.isArray(attr.values) ? attr.values.join(", ") : "-";
                      return (
                        <div key={i} className="text-sm">
                          <strong>{parentName || "—"}:</strong> {values}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No attributes</div>
                )}
              </div>

              {/* Images Grid */}
              {selectedProduct.images?.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`product-${idx}`} className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-gray-500">No images available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Form Modal */}
      {showProductEditForm && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-8 pb-8 overflow-auto">
          <div className="bg-white rounded-lg w-[95%] max-w-6xl p-6 relative">
            <button
              className="absolute right-4 top-4 text-lg font-bold"
              onClick={() => {
                setShowProductEditForm(false);
                setSelectedProduct(null);
              }}
            >
              &times;
            </button>

            <ProductForm
              productData={selectedProduct}
              isEditMode={true}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TableComponent;
