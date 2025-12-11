import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageLoader from "../../components/ui/PageLoader";
import Swal from "sweetalert2";

import { getAllProductList } from "../../api/product-management-api";
import { createPromotion } from "../../api/auth-api";

const MarketingForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    file: null,
    productId: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // validate form
  useEffect(() => {
    const valid =
      Boolean(formData.productId) &&
      Boolean(formData.type) &&
      Boolean(formData.file);

    setIsFormValid(valid);

    console.log("FORM DATA:", formData);
    console.log("IS VALID:", valid);
  }, [formData]);

  // load products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const list = await getAllProductList();
        // list should be array of Product docs
        setProducts(list);
      } catch (error) {
        console.error("Error fetching product list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED", { isFormValid, formData });

    if (!isFormValid) {
      Swal.fire("Validation", "Please fill all fields and select a file.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("type", formData.type);
      fd.append("productId", formData.productId);
      fd.append("file", formData.file);

      const response = await createPromotion(fd);
      console.log("createPromotion response:", response);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Form submitted successfully!",
      }).then(() => {
        window.location.reload();
      });

      setFormData({
        type: "",
        file: null,
        productId: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to submit form. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  
  const productOptions = products.map((item) => ({
    value: item._id,
    label: `${item.productId || ""} `.trim(),
  }));

  const selectedProductOption =
    productOptions.find((opt) => opt.value === formData.productId) || null;

  if (loading || submitting) {
    return <PageLoader />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {/* Product Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <Select
              name="productId"
              value={selectedProductOption}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  productId: selectedOption?.value || "",
                }))
              }
              options={productOptions}
              placeholder="Choose a product"
              isSearchable
            />
          </div>

          {/* Media type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Media Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Choose an option</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          {/* File upload */}
          {formData.type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload {formData.type}
              </label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="w-full"
                accept={
                  formData.type === "image"
                    ? "image/*"
                    : formData.type === "video"
                    ? "video/*"
                    : formData.type === "pdf"
                    ? "application/pdf"
                    : "*/*"
                }
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition ${
              isFormValid
                ? "bg-bg-color text-white cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarketingForm;
