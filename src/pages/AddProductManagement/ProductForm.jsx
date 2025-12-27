// src/pages/products/ProductForm.jsx
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PageLoader from "../../components/ui/PageLoader";

import {
  getCategoryList,
  getAllAttributes,
  addProductForm,
  updateProduct,
} from "../../api/product-management-api";

// Helpers
const isQuillEmpty = (value = "") => {
  const text = value.replace(/<(.|\n)*?>/g, "").replace(/&nbsp;/g, "").trim();
  return text.length === 0;
};

const stripHtml = (html = "") => html.replace(/<(.|\n)*?>/g, "").replace(/&nbsp;/g, "").trim();

const ProductForm = ({
  productData = null,
  isEditMode = false,
  onProductAdd,
  onProductUpdate,
}) => {
  const initialState = {
    productId: "",
    product_category: [],
    attributes: [],
    combination: "",
    pack_size: "",
    stock: 0,
    originalStock: 0,
    gst_in_percentage: 0,
    product_mrp: 0,
    franchisee_price: 0,
    detail_description: "",
    images: [],
    isDeleted: false,
  };

  const [payload, setPayload] = useState({ ...initialState });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const fileInputRef = useRef(null);

  // Attributes mapping
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

  // Fetch categories & attributes
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const categoryResp = await getCategoryList();
        const cats = Array.isArray(categoryResp) ? categoryResp : categoryResp?.categories || [];
        setCategoriesData(cats);

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

  // Populate form in edit mode
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
      product_category: incomingCategories,
      attributes: incomingAttributes,
      combination: productData.combination || "",
      pack_size: productData.pack_size || "",
      stock: productData.stock ?? 0,
      originalStock: productData.originalStock ?? 0,
      gst_in_percentage: productData.gst_in_percentage ?? productData.gstPercentage ?? 0,
      product_mrp: productData.product_mrp ?? productData.price ?? 0,
      franchisee_price: productData.franchisee_price ?? productData.franchiseePrice ?? 0,
      detail_description: productData.detail_description || productData.description || "",
      images: productData.images || [],
      isDeleted: !!productData.isDeleted,
    });
  }, [isEditMode, productData]);

  /* ---------------- Image handlers ---------------- */
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024;
    try {
      const validFiles = files.filter((file) => {
        if (file.size > maxSize) {
          Swal.fire({ icon: "error", title: "File too large", text: `${file.name} exceeds 5MB limit` });
          return false;
        }
        return true;
      });

      const base64s = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
            })
        )
      );

      setBase64Images((prev) => [...prev, ...base64s]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Image read error:", err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to read image(s)" });
    }
  };

  const removePayloadImage = (index) =>
    setPayload((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  const removeBase64Image = (index) => setBase64Images((prev) => prev.filter((_, i) => i !== index));

  /* ---------------- Attributes ---------------- */
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

  /* ---------------- Validation ---------------- */
  const validateFields = () => {
    const temp = {};
    if (!payload.product_category || payload.product_category.length === 0) temp.product_category = "Product Category is required!";
    if (!payload.combination || !payload.combination.trim()) temp.combination = "Product Combination is required!";
    if (payload.stock === "" || payload.stock === null || Number(payload.stock) < 0) temp.stock = "Valid stock is required!";
    if (!payload.pack_size || !payload.pack_size.trim()) temp.pack_size = "Pack Size is required!";
    if (payload.product_mrp === "" || Number(payload.product_mrp) <= 0) temp.product_mrp = "Valid MRP is required!";
    if (payload.franchisee_price === "" || Number(payload.franchisee_price) < 0) temp.franchisee_price = "Valid Franchisee Price is required!";
    if (isQuillEmpty(payload.detail_description)) temp.detail_description = "Product Description is required!";

    payload.attributes.forEach((entry, idx) => {
      if (!entry.attribute) temp[`attributes.${idx}.attribute`] = "Select a parent attribute.";
      if (!entry.values || entry.values.length === 0) temp[`attributes.${idx}.values`] = "Select or add at least one child value.";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const normalized = {
        ...payload,
        stock: Number(payload.stock),
        originalStock: Number(payload.originalStock || payload.stock || 0),
        product_mrp: Number(payload.product_mrp),
        franchisee_price: Number(payload.franchisee_price),
        gst_in_percentage: Number(payload.gst_in_percentage),
        images: [...payload.images, ...base64Images],
        attributes: payload.attributes.map((a) => ({ attribute: String(a.attribute), values: Array.isArray(a.values) ? a.values : [] })),
        detail_description: stripHtml(payload.detail_description),
      };

      if (isEditMode) {
        const updated = await updateProduct(productData._id, normalized);
        await Swal.fire({ icon: "success", title: "Success", text: "Product updated successfully" });
        if (onProductUpdate) onProductUpdate(updated);
      } else {
        const newProduct = await addProductForm(normalized);
        await Swal.fire({ icon: "success", title: "Success", text: "Product added successfully" });


        // Full reset
        handleReset();

        if (onProductAdd) onProductAdd(newProduct);
      }
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET FORM ---------------- */
  const handleReset = () => {
    setPayload({ ...initialState });
    setBase64Images([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const categoryOptions = categoriesData.map((c) => ({ value: String(c._id), label: c.name }));

  return (
    <div>
      {loading && <PageLoader />}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <InputField label="Product ID" value={payload.productId} onChange={(e) => setPayload({ ...payload, productId: e.target.value })} />
          <InputField label="Product Name" value={payload.combination} onChange={(e) => setPayload({ ...payload, combination: e.target.value })} error={errors.combination} />
          <InputField label="Stock" type="number" value={payload.stock} onChange={(e) => setPayload({ ...payload, stock: e.target.value })} error={errors.stock} />
          <InputField label="Pack Size" value={payload.pack_size} onChange={(e) => setPayload({ ...payload, pack_size: e.target.value })} error={errors.pack_size} />
          <InputField label="GST %" type="number" value={payload.gst_in_percentage} onChange={(e) => setPayload({ ...payload, gst_in_percentage: e.target.value })} />
          <InputField label="MRP" type="number" value={payload.product_mrp} onChange={(e) => setPayload({ ...payload, product_mrp: e.target.value })} error={errors.product_mrp} />
          <InputField label="Vendor Price" type="number" value={payload.franchisee_price} onChange={(e) => setPayload({ ...payload, franchisee_price: e.target.value })} error={errors.franchisee_price} />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700">Select Product Category</label>
          <Select
            options={categoryOptions}
            isMulti
            value={categoryOptions.filter((opt) => (payload.product_category || []).map(String).includes(String(opt.value)))}
            onChange={(selected) => setPayload({ ...payload, product_category: selected ? selected.map((s) => String(s.value)) : [] })}
          />
          {errors.product_category && <p className="text-red-500 text-sm">{errors.product_category}</p>}
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-700">Detailed Description</label>
          <ReactQuill value={payload.detail_description} onChange={(value) => setPayload({ ...payload, detail_description: value })} />
          {errors.detail_description && <p className="text-red-500 text-sm">{errors.detail_description}</p>}
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

        <div>
          <label className="block text-sm font-normal text-gray-700 mt-3">Upload Images</label>
          <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {payload.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                <button type="button" className="absolute top-0 right-0 text-red-500" onClick={() => removePayloadImage(idx)}><MdDeleteForever /></button>
              </div>
            ))}
            {base64Images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                <button type="button" className="absolute top-0 right-0 text-red-500" onClick={() => removeBase64Image(idx)}><MdDeleteForever /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-5">
          <Button title={isEditMode ? "Update Product" : "Add Product"} onClick={handleSubmit} />
          <Button title="Reset" type="button" onClick={handleReset} />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
