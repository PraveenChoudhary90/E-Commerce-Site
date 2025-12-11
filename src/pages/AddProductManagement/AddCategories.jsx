// src/pages/category/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

// API helpers - ensure these exist in your api/product-management-api
import {
  getCategoryList,
  addCategory,
  editCategoryType,
  deleteCategoryType,
  //deleteCategory,
} from "../../api/product-management-api";

/**
 * CategoryManager - full page with list + add/edit form modal + delete
 */
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // refresh list
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setFetching(true);
      const resp = await getCategoryList();
      // adapt if your API returns { categories: [...] }
      const arr = Array.isArray(resp) ? resp : resp?.categories || [];
      setCategories(arr);
    } catch (err) {
      console.error("loadCategories err:", err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load categories" });
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
      Swal.fire({ icon: "success", title: "Deleted", text: "Category deleted" });
      await loadCategories();
    } catch (err) {
      console.error("deleteCategory err:", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Delete failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {fetching ? <PageLoader /> : null}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadCategories}
            title="Refresh"
            bgcolor="bg-gray-200"
          />
          <Button
            onClick={openAddModal}
            title="Add Category"
            bgcolor="bg-[#32C98D]"
            className="flex items-center gap-2"
          >
            <FaPlus />
            <span className="text-white">{/* label shown by title prop */}</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="border rounded p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {cat.image ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img src={cat.image} alt={`${cat.name} image`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-xs text-gray-500">{cat._id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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

/* ---------------------------------------------------------------------------
   CategoryModal component - contains the Add/Edit form and handles saving
   --------------------------------------------------------------------------- */
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
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
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

          {/* optionally: other meta fields */}
        </div>
      </div>
    </div>
  );
};
