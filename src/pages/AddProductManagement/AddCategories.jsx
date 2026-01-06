import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

import {
  getCategoryList,
  addCategory,
  editCategoryType,
  deleteCategoryType,
} from "../../api/product-management-api";

/* ===================== CATEGORY MANAGER ===================== */

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setFetching(true);
      const resp = await getCategoryList();
      const arr = Array.isArray(resp) ? resp : resp?.categories || [];
      setCategories(arr);
    } catch (err) {
      console.error("loadCategories err:", err);
      Swal.fire("Error", "Failed to load categories", "error");
    } finally {
      setFetching(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedCategory(null);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditMode(true);
    setSelectedCategory(cat);
    setShowModal(true);
  };

  const handleDelete = async (cat) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: `Delete category "${cat.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    try {
      setLoading(true);
      await deleteCategoryType(cat._id);
      Swal.fire("Deleted", "Category deleted", "success");
      loadCategories();
    } catch (err) {
      console.error("deleteCategory err:", err);
      Swal.fire("Error", "Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {fetching && <PageLoader />}

     <div className="flex flex-col sm:flex-row justify-between mb-6 gap-2 sm:gap-0">
  <h1 className="text-2xl font-semibold">Categories</h1>

  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
    <Button 
      title="Refresh" 
      onClick={loadCategories} 
      bgcolor="bg-gray-200" 
      className="w-full sm:w-auto"
    />
    <Button
      title="Add Category"
      bgcolor="bg-[#32C98D]"
      className="flex items-center gap-2 w-full sm:w-auto justify-center"
      onClick={openAddModal}
    >
      <FaPlus />
    </Button>
  </div>
</div>


      {/* ===================== TABLE VIEW ===================== */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories found</div>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Index</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  {/* SR NO */}
                  <td className="px-4 py-3">{index + 1}</td>

                  {/* IMAGE */}
                  <td className="px-4 py-3">
                    <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={`${cat.name} image`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </div>
                  </td>

                  {/* NAME */}
                  <td className="px-4 py-3 font-medium">{cat.name}</td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete"
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
      </div>

      {/* ===================== CATEGORY MODAL ===================== */}
      {showModal && (
        <CategoryModal
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
            setEditMode(false);
          }}
          editMode={editMode}
          selectedCategory={selectedCategory}
          onSaved={() => {
            setShowModal(false);
            setSelectedCategory(null);
            setEditMode(false);
            loadCategories();
          }}
        />
      )}

      {loading && <PageLoader />}
    </div>
  );
};

export default CategoryManager;

/* ===================== CATEGORY MODAL ===================== */
const CategoryModal = ({ onClose, editMode = false, selectedCategory = null, onSaved }) => {
  const [payload, setPayload] = useState({ name: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editMode && selectedCategory) {
      setPayload({ name: selectedCategory.name || "" });
      setPreviewUrl(selectedCategory.image || "");
      setImageFile(null);
    } else {
      setPayload({ name: "" });
      setImageFile(null);
      setPreviewUrl("");
    }
  }, [editMode, selectedCategory]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setImageFile(null);
      setPreviewUrl(selectedCategory?.image || "");
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      Swal.fire({ icon: "error", title: "Image too large", text: "Max 5MB" });
      return;
    }
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const validate = () => {
    if (!payload.name.trim()) {
      Swal.fire({ icon: "error", title: "Validation", text: "Name is required" });
      return false;
    }
    if (!editMode && !imageFile && !previewUrl) {
      Swal.fire({ icon: "error", title: "Validation", text: "Image is required" });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", payload.name.trim());
      if (imageFile) fd.append("image", imageFile);

      if (editMode && selectedCategory?._id) {
        await editCategoryType(fd, selectedCategory._id);
        Swal.fire({ icon: "success", title: "Updated", text: "Category updated" });
      } else {
        await addCategory(fd);
        Swal.fire({ icon: "success", title: "Created", text: "Category added" });
      }

      if (typeof onSaved === "function") onSaved();
    } catch (err) {
      console.error("save category err:", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg overflow-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">{editMode ? "Edit Category" : "Add Category"}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-[#32C98D] text-white text-sm"
              disabled={saving}
            >
              {saving ? "Saving..." : editMode ? "Update" : "Save"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                label="Category Name"
                value={payload.name}
                onChange={(e) => setPayload({ ...payload, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Image</label>
              <div className="flex gap-3 items-center">
                <div className="w-28 h-20 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>

                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleFile} />
                  <p className="text-xs text-gray-400 mt-1">Recommended JPG/PNG, max 5MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
