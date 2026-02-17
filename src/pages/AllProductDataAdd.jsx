import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCategories, updateItem, deleteItem } from "../api/auth-api";
import Footer1 from "../components/Footer1";

const ProductCard = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    product_mrp: "",
    user_price: "",
    gst_in_percentage: "",
  });

  const [currentImages, setCurrentImages] = useState([]); // Existing images
  const [newImages, setNewImages] = useState([]); // New uploaded images

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      let arr = [];
      if (res) {
        if (Array.isArray(res)) arr = res;
        else if (Array.isArray(res.data)) arr = res.data;
        else if (Array.isArray(res.data?.data)) arr = res.data.data;
      }
      setItems(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      product_mrp: item.product_mrp || "",
      user_price: item.user_price || "",
      gst_in_percentage: item.gst_in_percentage || "",
    });

    setCurrentImages(item.images || []); // Existing images
    setNewImages([]); // Reset new uploads
    setIsModalOpen(true);
  };

  const handleDeleteImage = (index) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.gst_in_percentage < 0 || formData.gst_in_percentage > 100) {
      Swal.fire("Invalid GST", "GST must be between 0 and 100%", "warning");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("product_mrp", formData.product_mrp);
    data.append("user_price", formData.user_price);
    data.append("gst_in_percentage", formData.gst_in_percentage);

    // Send remaining existing images URLs
    data.append("existingImages", JSON.stringify(currentImages));

    // Send new images
    newImages.forEach((img) => data.append("images", img));

    try {
      const updatedItem = await updateItem(selectedItem._id, data);

      if (updatedItem && updatedItem._id) {
        setItems((prev) =>
          prev.map((it) => (it._id === updatedItem._id ? updatedItem : it))
        );
      } else {
        fetchData();
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      setCurrentImages([]);
      setNewImages([]);

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
        <table className="min-w-full border border-gray-200 rounded-lg whitespace-nowrap">
          <thead className="bg-gray-100">
            <tr className="text-sm text-gray-600 text-left">
              <th className="p-3 border">Index</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">MRP</th>
              <th className="p-3 border">User Price</th>
              <th className="p-3 border">GST</th>
              <th className="p-3 border">Attributes</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((el, index) => (
              <tr key={el._id} className="hover:bg-gray-50">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">
                  {Array.isArray(el.images) && el.images.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {el.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`product-${i}`}
                          className="w-24 h-16 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src="https://via.placeholder.com/80x60?text=No+Image"
                      alt="No Image"
                      className="w-24 h-16 object-cover rounded-lg shadow-md"
                    />
                  )}
                </td>
                <td className="p-3 border font-medium">
                  <Link
                    // to={`/products/${el._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {el.name || "NA"}
                  </Link>
                </td>
                <td className="p-3 border text-sm text-gray-600">
                  {el.description || "NA"}
                </td>
                <td className="p-3 border">₹{el.product_mrp || "NA"}</td>
                <td className="p-3 border text-green-700 font-semibold">
                  ₹{el.user_price || "NA"}
                </td>
                <td className="p-3 border">{el.gst_in_percentage || "NA"}%</td>
                <td className="p-3 border">
  {Array.isArray(el.attributes) && el.attributes.length > 0
    ? el.attributes
        .map((attr) => {
          if (!attr?.attribute?.name) return null;

          const values = Array.isArray(attr.values)
            ? attr.values.join(", ")
            : "";

          return `${attr.attribute.name}: ${values}`;
        })
        .filter(Boolean)
        .join(" | ")
    : "NA"}
</td>

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

      <Footer1/>

      {/* UPDATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Update Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Product Name */}
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
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Enter description"
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

              {/* User Price */}
              <div>
                <label className="block text-sm font-medium">User Price (₹)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={formData.user_price}
                  onChange={(e) =>
                    setFormData({ ...formData, user_price: e.target.value })
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
                    setFormData({
                      ...formData,
                      gst_in_percentage: e.target.value,
                    })
                  }
                />
              </div>

              {/* Existing Images with Delete */}
              <div>
                <label className="block text-sm font-medium">Existing Images</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {currentImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`existing-${index}`}
                        className="w-24 h-16 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Image Upload */}
              {/* New Image Upload */}
<div>
  <label className="block text-sm font-medium">Add New Images</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleNewImageUpload}
    className="w-full border p-2 rounded mt-2"
  />
  <div className="flex gap-2 flex-wrap mt-2">
    {newImages.map((img, index) => (
      <div key={index} className="relative">
        <img
          src={URL.createObjectURL(img)}
          alt={`new-${index}`}
          className="w-24 h-16 object-cover rounded-lg shadow-md"
        />
        {/* Delete button for new image */}
        <button
          type="button"
          onClick={() =>
            setNewImages((prev) => prev.filter((_, i) => i !== index))
          }
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>


              {/* Submit Buttons */}
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
