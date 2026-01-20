import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCategories, updateItem, deleteItem } from "../api/auth-api";

const ProductCard = () => {
  const [items, setItems] = useState([]);
  const [isCategoryList, setIsCategoryList] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    product_mrp: "",
    franchisee_price: "",
    gst_in_percentage: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      const arr = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      const looksLikeCategories =
        arr.length > 0 &&
        arr.every((it) => it && (it.name || it._id) && !it.combination);

      setItems(arr);
      setIsCategoryList(looksLikeCategories);
    } catch (error) {
      console.error(error);
    }
  };

  const getImageSrc = (el) => {
    if (Array.isArray(el?.images) && el.images.length > 0) {
      return el.images[0]?.url;
    }
    return "https://via.placeholder.com/80x60?text=No+Image";
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || item.combination || "",
      description: item.detail_description || "",
      product_mrp: item.product_mrp || "",
      franchisee_price: item.franchisee_price || "",
      gst_in_percentage: item.gst_in_percentage || "",
      stock: item.stock || "",
      image: null,
    });
    setIsModalOpen(true);
  };

  // 🔹 UPDATE PRODUCT (ImageKit supported)
  const handleUpdate = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("description", formData.description);
  data.append("product_mrp", formData.product_mrp);
  data.append("franchisee_price", formData.franchisee_price);
  data.append("gst_in_percentage", formData.gst_in_percentage);
  data.append("stock", formData.stock);
  if (formData.image) data.append("image", formData.image);

  try {
    const updatedItem = await updateItem(selectedItem._id, data);

    // 🔹 If API returns full updated product
    if (updatedItem && updatedItem._id) {
      setItems((prev) =>
        prev.map((it) => (it._id === updatedItem._id ? updatedItem : it))
      );
    } else {
      // 🔹 If API returns partial object, fetch full product
      const res = await getCategories(); // or fetch single product API if available
      setItems(res);
    }

    setIsModalOpen(false);
    setSelectedItem(null);

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Product updated successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Something went wrong while updating product.",
    });
  }
};


  // 🔹 DELETE PRODUCT
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This product will be removed from the list!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteItem(id);

    setItems((prev) => prev.filter((it) => it._id !== id));

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Product has been deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while deleting.",
    });
  }
};


  return (
    <div className="w-full overflow-x-auto p-4">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No data found</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-sm text-gray-600 text-left">
              <th className="p-3 border">Index</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">
                {isCategoryList ? "Category Name" : "Product Name"}
              </th>
              {!isCategoryList && (
                <>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">MRP</th>
                  <th className="p-3 border">Vendor Price</th>
                  <th className="p-3 border">GST</th>
                  <th className="p-3 border">Stock</th>
                </>
              )}
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((el, index) => (
              <tr key={el._id} className="hover:bg-gray-50">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">
                  <img
                    src={getImageSrc(el)}
                    alt=""
                    className="w-16 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3 border font-medium">
                  <Link
                    to={`/products/${el._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {isCategoryList ? el?.name ?? "-" : el?.combination ?? "-"}
                  </Link>
                </td>
                {!isCategoryList && (
                  <>
                    <td className="p-3 border text-sm text-gray-600">
                      {el.detail_description || "-"}
                    </td>
                    <td className="p-3 border">₹{el.product_mrp}</td>
                    <td className="p-3 border text-green-700 font-semibold">
                      ₹{el.franchisee_price}
                    </td>
                    <td className="p-3 border">{el.gst_in_percentage}%</td>
                    <td className="p-3 border">{el.stock}</td>
                  </>
                )}
                <td className="p-3 border">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(el)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(el._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* UPDATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Update Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium">
                  Detailed Description
                </label>
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Enter detailed description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              {/* MRP */}
              <div>
                <label className="block text-sm font-medium">MRP (₹)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={formData.product_mrp}
                  onChange={(e) =>
                    setFormData({ ...formData, product_mrp: e.target.value })
                  }
                />
              </div>
              {/* Franchisee Price */}
              <div>
                <label className="block text-sm font-medium">
                  Vendor Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={formData.franchisee_price}
                  onChange={(e) =>
                    setFormData({ ...formData, franchisee_price: e.target.value })
                  }
                />
              </div>
              {/* GST */}
              <div>
                <label className="block text-sm font-medium">GST (%)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={formData.gst_in_percentage}
                  onChange={(e) =>
                    setFormData({ ...formData, gst_in_percentage: e.target.value })
                  }
                />
              </div>
              {/* Stock */}
              <div>
                <label className="block text-sm font-medium">Stock Quantity</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
              {/* Image */}
              <div>
                <label className="block text-sm font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>
              {/* Preview */}
              <div className="flex gap-3">
                {selectedItem?.images?.[0]?.url && !formData.image && (
                  <img
                    src={selectedItem.images[0].url}
                    alt="old"
                    className="w-20 h-16 object-cover rounded"
                  />
                )}
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="preview"
                    className="w-20 h-16 object-cover rounded"
                  />
                )}
              </div>
              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 pb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
