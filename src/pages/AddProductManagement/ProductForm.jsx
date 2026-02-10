// src/pages/products/ProductForm.jsx
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PageLoader from "../../components/ui/PageLoader";

import {
  getCategoryList,
  getAllAttributes,
  addProductForm,
  updateProduct,
} from "../../api/product-management-api";

const ProductForm = ({ productData = null, isEditMode = false, onProductAdd, onProductUpdate }) => {
  const initialState = {
    productId: "",
    name: "",
    brand: "",
    product_category: [],
    gst_in_percentage: 0,
    product_mrp: 0,
    user_price: 0,
    description: "",
    attributes: [],
    images: [], // Existing image URLs
  };

  const [payload, setPayload] = useState({ ...initialState });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // <-- new files
  const fileInputRef = useRef(null);

  /* ---------------- Image handlers ---------------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        Swal.fire({ icon: "error", title: "File too large", text: `${file.name} exceeds 5MB limit` });
        return false;
      }
      return true;
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = (index) =>
    setPayload((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  const removeNewImageFile = (index) => setImageFiles((prev) => prev.filter((_, i) => i !== index));

  /* ---------------- Submit with FormData ---------------- */
  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("productId", payload.productId);
      formData.append("name", payload.name);
      formData.append("brand", payload.brand);
      formData.append("gst_in_percentage", payload.gst_in_percentage);
      formData.append("product_mrp", payload.product_mrp);
      formData.append("user_price", payload.user_price);
      formData.append("description", payload.description);

      // categories as array
      payload.product_category.forEach((cat) => formData.append("product_category[]", cat));

      // attributes as JSON string
      formData.append("attributes", JSON.stringify(payload.attributes));

      // existing images URLs (if any)
      payload.images.forEach((imgUrl) => formData.append("existing_images[]", imgUrl));

      // new files
      imageFiles.forEach((file) => formData.append("images", file));

      if (isEditMode) {
        const updated = await updateProduct(productData._id, formData, true); // true => multipart
        await Swal.fire({ icon: "success", title: "Success", text: "Product updated successfully" });
        if (onProductUpdate) onProductUpdate(updated);
      } else {
        const newProduct = await addProductForm(formData, true);
        await Swal.fire({ icon: "success", title: "Success", text: "Product added successfully" });
        handleReset();
        if (onProductAdd) onProductAdd(newProduct);
      }
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET FORM ---------------- */
  const handleReset = () => {
    setPayload({ ...initialState });
    setImageFiles([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- Validation ---------------- */
  const validateFields = () => {
    const temp = {};
    if (!payload.name.trim()) temp.name = "Name is required!";
    if (!payload.product_category || payload.product_category.length === 0) temp.product_category = "Product Category is required!";
    if (!payload.product_mrp || Number(payload.product_mrp) <= 0) temp.product_mrp = "Valid MRP is required!";
    if (payload.user_price === "" || Number(payload.user_price) < 0) temp.user_price = "Valid User Price is required!";
    if (!payload.description.trim()) temp.description = "Product Description is required!";

    payload.attributes.forEach((entry, idx) => {
      if (!entry.attribute) temp[`attributes.${idx}.attribute`] = "Select a parent attribute.";
      if (!entry.values || entry.values.length === 0) temp[`attributes.${idx}.values`] = "Select or add at least one child value.";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /* ---------------- CATEGORY & ATTRIBUTES SETUP ---------------- */
  const parents = attributesList.filter((a) => !a.parentAttribute);
  const childrenMap = {};
  attributesList.forEach((a) => {
    const pid = a.parentAttribute ? (a.parentAttribute._id || a.parentAttribute) : null;
    if (pid) {
      const key = String(pid);
      childrenMap[key] = childrenMap[key] || [];
      childrenMap[key].push({ value: a.name, label: a.name });
    }
  });

  const parentOptions = parents.map((p) => ({ value: String(p._id), label: p.name }));

  const addAttributeEntry = () => setPayload((prev) => ({ ...prev, attributes: [...prev.attributes, { attribute: "", values: [] }] }));

  const updateParentForEntry = (index, parentId) => {
    const pId = parentId ? String(parentId) : "";
    const duplicate = payload.attributes.some((entry, i) => i !== index && String(entry.attribute) === pId);
    if (duplicate) {
      Swal.fire({ icon: "warning", title: "Duplicate Attribute", text: "This parent attribute is already selected." });
      return;
    }
    setPayload((prev) => {
      const next = prev.attributes.map((entry, i) => (i === index ? { ...entry, attribute: pId, values: [] } : entry));
      return { ...prev, attributes: next };
    });
  };

  const updateValuesForEntry = (index, selectedOptions) => {
    const values = Array.isArray(selectedOptions) ? selectedOptions.map((o) => String(o.value)) : [];
    setPayload((prev) => {
      const next = prev.attributes.map((entry, i) => (i === index ? { ...entry, values } : entry));
      return { ...prev, attributes: next };
    });
  };

  const removeAttributeEntry = (index) => setPayload((prev) => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));

  /* ---------------- FETCH INITIAL DATA ---------------- */
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const categoryResp = await getCategoryList();
        setCategoriesData(Array.isArray(categoryResp) ? categoryResp : categoryResp?.categories || []);

        const attrs = await getAllAttributes();
        setAttributesList(Array.isArray(attrs) ? attrs : []);
      } catch (err) {
        console.error("Error loading initial data:", err);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to load initial data" });
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  /* ---------------- EDIT MODE POPULATE ---------------- */
  useEffect(() => {
    if (!isEditMode || !productData) return;

    const incomingCategories = Array.isArray(productData.product_category)
      ? productData.product_category.map((c) => (typeof c === "object" ? String(c._id) : String(c)))
      : [];

    const incomingAttributes = Array.isArray(productData.attributes)
      ? productData.attributes.map((a) => {
          const attrId = a.attribute?._id || a.attribute || a._id || null;
          const values = Array.isArray(a.values)
            ? a.values.map((v) => (typeof v === "object" ? v.name || String(v._id) : String(v)))
            : [];
          return { attribute: attrId ? String(attrId) : "", values };
        })
      : [];

    setPayload({
      productId: productData.productId || "",
      name: productData.combination || productData.name || "",
      brand: productData.brand || "",
      product_category: incomingCategories,
      gst_in_percentage: productData.gst_in_percentage ?? 0,
      product_mrp: productData.product_mrp ?? 0,
      user_price: productData.franchisee_price ?? productData.user_price ?? 0,
      description: productData.description || "",
      attributes: incomingAttributes,
      images: productData.images || [],
    });
  }, [isEditMode, productData]);

  const categoryOptions = categoriesData.map((c) => ({ value: String(c._id), label: c.name }));

  return (
    <div>
      {loading && <PageLoader />}
      <div className="space-y-5">
        {/* Product Info Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <InputField
            label="Product ID"
            placeholder="Enter Product ID"
            value={payload.productId}
            onChange={(e) => setPayload({ ...payload, productId: e.target.value })}
          />
          <InputField
            label="Name"
            placeholder="Enter Product Name"
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            error={errors.name}
          />
          <InputField
            label="Brand"
            placeholder="Enter Brand"
            value={payload.brand}
            onChange={(e) => setPayload({ ...payload, brand: e.target.value })}
          />
          <InputField
            label="GST %"
            placeholder="Enter GST %"
            type="number"
            value={payload.gst_in_percentage || ""}
            onChange={(e) => setPayload({ ...payload, gst_in_percentage: e.target.value })}
          />
          <InputField
            label="MRP"
            placeholder="Enter MRP"
            type="number"
            value={payload.product_mrp || ""}
            onChange={(e) => setPayload({ ...payload, product_mrp: e.target.value })}
            error={errors.product_mrp}
          />
          <InputField
            label="User Price"
            placeholder="Enter User Price"
            type="number"
            value={payload.user_price || ""}
            onChange={(e) => setPayload({ ...payload, user_price: e.target.value })}
            error={errors.user_price}
          />
        </div>

        {/* Product Category */}
        <div>
          <label className="block text-sm font-normal text-gray-700">Select Product Category</label>
          <Select
            options={categoryOptions}
            isMulti
            placeholder="Select Product Category"
            value={categoryOptions.filter((opt) => (payload.product_category || []).map(String).includes(String(opt.value)))}
            onChange={(selected) => setPayload({ ...payload, product_category: selected ? selected.map((s) => String(s.value)) : [] })}
          />
          {errors.product_category && <p className="text-red-500 text-sm">{errors.product_category}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mt-3">Description</label>
          <textarea
            placeholder="Enter Product Description"
            value={payload.description}
            onChange={(e) => setPayload({ ...payload, description: e.target.value })}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Attributes Section */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mt-3">Attributes</label>
          {payload.attributes.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-center mt-2">
              <Select
                options={parentOptions}
                value={parentOptions.find((opt) => String(opt.value) === String(entry.attribute)) || null}
                onChange={(opt) => updateParentForEntry(idx, opt?.value)}
                placeholder="Select Parent Attribute"
                className="w-1/3"
              />
              <CreatableSelect
                isMulti
                options={childrenMap[entry.attribute] || []}
                value={(entry.values || []).map((v) => ({ value: v, label: v }))}
                onChange={(opts) => updateValuesForEntry(idx, opts)}
                className="w-2/3"
              />
              <button type="button" onClick={() => removeAttributeEntry(idx)} className="text-red-500"><MdDeleteForever /></button>
            </div>
          ))}
          <button type="button" onClick={addAttributeEntry} className="mt-2 flex items-center gap-1 text-blue-500"><IoMdAdd /> Add Attribute</button>
        </div>

        {/* Upload Images */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mt-3">Upload Images</label>
          <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {payload.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                <button type="button" className="absolute top-0 right-0 text-red-500" onClick={() => removeExistingImage(idx)}><MdDeleteForever /></button>
              </div>
            ))}
            {imageFiles.map((file, idx) => (
              <div key={idx} className="relative">
                <img src={URL.createObjectURL(file)} alt="" className="w-20 h-20 object-cover rounded" />
                <button type="button" className="absolute top-0 right-0 text-red-500" onClick={() => removeNewImageFile(idx)}><MdDeleteForever /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-5 text-white">
          <Button title={isEditMode ? "Update Product" : "Add Product"} onClick={handleSubmit} />
          <Button title="Reset" type="button" onClick={handleReset} />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
