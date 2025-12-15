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
const isQuillEmpty = (value = "") => {
  const text = value
    .replace(/<(.|\n)*?>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  return text.length === 0;
};

// Optional: convert HTML → plain text
const stripHtml = (html = "") =>
  html.replace(/<(.|\n)*?>/g, "").replace(/&nbsp;/g, "").trim();

const ProductForm = ({ productData = null, isEditMode = false, setCurrentPage, currentPage }) => {
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

  const [payload, setPayload] = useState({ ...initialState, images: productData?.images || [] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const fileInputRef = useRef(null);

  // Build parents & children map
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

  useEffect(() => {
    if (isEditMode && productData) {
      // Normalize incoming categories
      const incomingCategories = Array.isArray(productData.product_category)
        ? productData.product_category.map((c) => (typeof c === "object" ? String(c._id) : String(c)))
        : Array.isArray(productData.category)
          ? productData.category.map((c) => (typeof c === "object" ? String(c._id) : String(c)))
          : Array.isArray(productData.product_category)
            ? productData.product_category.map(String)
            : [];

      // Normalize incoming attributes
      const incomingAttributes = Array.isArray(productData.attributes)
        ? productData.attributes.map((a) => {
          const attrId = a.attribute?._id || a.attribute || a._id || null;
          const values =
            Array.isArray(a.values) ? a.values.map((v) => (typeof v === "object" ? v.name || String(v._id) : String(v))) : [];
          return { attribute: attrId ? String(attrId) : "", values };
        })
        : [];

      setPayload((p) => ({
        ...p,
        productId: productData.productId || "",
        product_category: incomingCategories.map(String),
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
      }));
    }
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

  /* ---------------- Attributes helpers ---------------- */
  const parentOptions = parents.map((p) => ({ value: String(p._id), label: p.name }));

  const addAttributeEntry = () =>
    setPayload((prev) => ({ ...prev, attributes: [...prev.attributes, { attribute: "", values: [] }] }));

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
    if (isQuillEmpty(payload.detail_description))
      temp.detail_description = "Product Description is required!";

    payload.attributes.forEach((a, i) => {
      if (!a.attribute)
        temp[`attributes.${i}.attribute`] = "Select parent attribute";
      if (!a.values.length)
        temp[`attributes.${i}.values`] = "Select at least one value";
    });
    

    payload.attributes.forEach((entry, idx) => {
      if (!entry.attribute) temp[`attributes.${idx}.attribute`] = "Select a parent attribute.";
      if (!entry.values || entry.values.length === 0) temp[`attributes.${idx}.values`] = "Select or add at least one child value.";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    console.log("Submitting payload:", payload);

    if (!validateFields()) {
      console.log("Validation failed, errors:", errors);
      return;
    }

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
      };

      console.log("Normalized payload:", normalized);

      if (isEditMode) {
        await updateProduct(productData._id, normalized);
        await Swal.fire({ icon: "success", title: "Success", text: "Product updated successfully" });
        if (typeof setCurrentPage === "function") setCurrentPage(currentPage);
        window.location.reload();
      } else {
        await addProductForm(normalized);
        await Swal.fire({ icon: "success", title: "Success", text: "Product added successfully" });
        window.location.reload();
      }
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPayload(initialState);
    setBase64Images([]);
    setErrors({});
  };

  /* ---------------- Rendering helpers ---------------- */
  const categoryOptions = categoriesData.map((c) => ({ value: String(c._id), label: c.name }));
  const findCategoryName = (id) => categoriesData.find((c) => String(c._id) === String(id))?.name || id;
  const findParentName = (id) => parents.find((p) => String(p._id) === String(id))?.name || id;

  return (
    <div>
      {loading && <PageLoader />}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <InputField label="Product ID" value={payload.productId} onChange={(e) => setPayload({ ...payload, productId: e.target.value })} />
          <InputField label="Enter Combination" value={payload.combination} onChange={(e) => setPayload({ ...payload, combination: e.target.value })} error={errors.combination} />
          <InputField label="Enter stock" type="number" value={payload.stock} onChange={(e) => setPayload({ ...payload, stock: e.target.value })} error={errors.stock} />
          <InputField label="Enter Pack Size" value={payload.pack_size} onChange={(e) => setPayload({ ...payload, pack_size: e.target.value })} error={errors.pack_size} />
          <InputField label="GST in Percentage" type="number" value={payload.gst_in_percentage} onChange={(e) => setPayload({ ...payload, gst_in_percentage: e.target.value })} error={errors.gst_in_percentage} />
          <InputField label="Product MRP" type="number" value={payload.product_mrp} onChange={(e) => setPayload({ ...payload, product_mrp: e.target.value })} error={errors.product_mrp} />
          <InputField label="Franchisee Price" type="number" value={payload.franchisee_price} onChange={(e) => setPayload({ ...payload, franchisee_price: e.target.value })} error={errors.franchisee_price} />

          <div className="lg:col-span-3 md:col-span-2 col-span-1">
            <label className="block text-sm font-normal text-gray-700">Select Product Category</label>
            <Select
              options={categoryOptions}
              isMulti
              value={categoryOptions.filter((opt) => (payload.product_category || []).map(String).includes(String(opt.value)))}
              onChange={(selected) => setPayload({ ...payload, product_category: selected ? selected.map((s) => String(s.value)) : [] })}
              styles={{ control: (styles) => ({ ...styles, backgroundColor: "#f7f7f7", border: "1px solid #d1d5da", fontSize: "0.875rem", marginTop: "0.25rem" }) }}
            />
            {errors.product_category && <p className="text-red-500 text-sm">{errors.product_category}</p>}

            {payload.product_category && payload.product_category.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-semibold">Selected Categories:</h3>
                <ul className="list-disc pl-5 flex gap-2 mt-2 flex-wrap">
                  {payload.product_category.map((cid) => (
                    <li key={cid} className="text-sm px-2 py-1 flex items-center gap-2 bg-gray-200 w-fit rounded-md">
                      {findCategoryName(cid)}
                      <button type="button" className="text-red-500" onClick={() => setPayload((prev) => ({ ...prev, product_category: prev.product_category.filter((x) => String(x) !== String(cid)) }))}>
                        <MdDeleteForever />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
        <label className="block text-sm font-normal text-gray-700">
          Detailed Description
        </label>

        <ReactQuill
          value={payload.detail_description}
          onChange={(value) =>
            setPayload({ ...payload, detail_description: value })
          }
        />

        {errors.detail_description && (
          <p className="text-red-500 text-sm">
            {errors.detail_description}
          </p>
        )}
      </div>

        <div>
          <h3 className="text-base mb-3">Attributes (Parent → Child values)</h3>
          <div className="mb-3">
            <button type="button" onClick={addAttributeEntry} className="px-3 py-1 rounded bg-blue-600 text-white">+ Add Attribute</button>
          </div>

          {payload.attributes.length === 0 && <div className="text-sm text-gray-500 mb-3">No attributes added yet.</div>}

          <div className="space-y-3">
            {payload.attributes.map((entry, idx) => {
              const parentIdStr = entry.attribute ? String(entry.attribute) : "";
              const childOptions = parentIdStr ? childrenMap[parentIdStr] || [] : [];
              const selectedValues = (entry.values || []).map((v) => ({ value: v, label: v }));
              return (
                <div key={idx} className="p-3 border rounded-md">
                  <div className="flex gap-4 items-start">
                    <div style={{ minWidth: 220 }}>
                      <label className="block text-xs text-gray-600">Parent Attribute</label>
                      <Select
                        options={parentOptions}
                        value={parentOptions.find((o) => String(o.value) === parentIdStr) || null}
                        onChange={(opt) => updateParentForEntry(idx, opt ? opt.value : "")}
                        placeholder="Select parent attribute..."
                      />
                      {errors[`attributes.${idx}.attribute`] && <p className="text-red-500 text-xs">{errors[`attributes.${idx}.attribute`]}</p>}
                    </div>

                    <div style={{ flex: 1 }}>
                      <label className="block text-xs text-gray-600">Child Values (existing children shown; you can type to create)</label>
                      <CreatableSelect
                        isMulti
                        onChange={(selected) => updateValuesForEntry(idx, selected)}
                        options={childOptions}
                        value={selectedValues}
                        placeholder={entry.attribute ? "Select or type to add values..." : "Select parent first"}
                        isDisabled={!entry.attribute}
                        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                      />
                      {errors[`attributes.${idx}.values`] && <p className="text-red-500 text-xs">{errors[`attributes.${idx}.values`]}</p>}
                    </div>

                    <div>
                      <button type="button" className="text-red-600" onClick={() => removeAttributeEntry(idx)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-base mb-3">Product Images</h3>
        <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:grid-cols-6 gap-5">
  {payload.images.map((img, i) => (
    <div key={`p-${i}`} className="relative w-full h-40">
      <img
        src={img.url}
        alt={`img-${i}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
        }}
        className="w-full h-full object-cover rounded-lg"
      />

      <button
        type="button"
        onClick={() => removePayloadImage(i)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  ))}

  {base64Images.map((b64, i) => (
    <div key={`b-${i}`} className="relative w-full h-40">
      <img
        src={b64}
        alt={`b-${i}`}
        className="w-full h-full object-cover rounded-lg"
      />

      <button
        type="button"
        onClick={() => removeBase64Image(i)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  ))}

  <div
    onClick={() => fileInputRef.current?.click()}
    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
  >
    <div className="text-center">
      <IoMdAdd className="mx-auto text-2xl text-gray-400" />
      <p className="text-sm text-gray-500">Add Images</p>
    </div>
  </div>
</div>

          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
        </div>

        <div className="flex gap-4 mt-8 justify-center">
          <Button title={isEditMode ? "Update Product" : "Add Product"} onClick={handleSubmit} disabled={loading} />
          <Button bgcolor="bg-[#FF5F5F]" title="Reset" onClick={handleReset} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
