import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddCategories from "./AddCategories";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

import {
  deleteCategoryType,
  getCategoryList,
} from "../../api/product-management-api";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import PageLoader from "../../components/ui/PageLoader";
import AttributeCrud from "./Attribute";

const tabs = ["Add Product", "Add Category", "Add Attribute"];

export default function AddProductManagement() {
  const [activeTab, setActiveTab] = useState(
    Number(localStorage.getItem("activeTab")) || 0
  );
  const [categories, setCategories] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Force ProductForm remount for full reset
  const [productFormKey, setProductFormKey] = useState(0);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const fetchFuncHandler = async (func, setState) => {
    try {
      setLoading(true);
      const res = await func();
      setState(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncHandler(getCategoryList, setCategories);
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteCategoryType(id);
      Swal.fire({
        icon: "success",
        title: "Category Deleted!",
        text: "Category Deleted Successfully",
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

  // Called when ProductForm successfully adds a product
  const handleProductAdded = (newProduct) => {
    // force ProductForm remount for full reset
    setProductFormKey((prev) => prev + 1);
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="p-5 bg-[#702F8A12] flex flex-col rounded-xl space-y-5 ">
        <h1 className="lg:text-xl md:text-lg text-sm font-medium">
          Add Products - Category
        </h1>

        {/* Tabs */}
        <div className="flex border-b bg-bg-color1 p-4 rounded-lg w-full whitespace-nowrap overflow-y-auto ">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative flex-1 p-3 px-8 text-center font-medium md:text-sm text-xs transition duration-300 ${
                activeTab === index ? "text-white" : "text-gray-700"
              }`}
            >
              {activeTab === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#702F8A] rounded-lg"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-bg-color1 p-6 rounded-lg w-full">
          {/* Tab 0: Add Product */}
          {activeTab === 0 && (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductForm
                key={productFormKey} // Force remount on insert
                onProductAdd={handleProductAdded}
              />
            </motion.div>
          )}

          {/* Tab 1: Add Category */}
          {activeTab === 1 && (
            <motion.div
              key="product-category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <AddCategories />
                <hr className="mt-4" />
                <div className="mt-6">
                  <h2 className="font-semibold mb-2">
                    Created Product Category
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(categories) &&
                      categories.map((category, index) => (
                        <div
                          key={category._id || index}
                          className="px-3 py-1 bg-white text-[#616161] border rounded-md flex gap-2 items-center justify-center"
                        >
                          <span>{category.name}</span>
                          <button
                            onClick={() => {
                              setShowEditForm(true);
                              setSelectedCategory(category);
                            }}
                          >
                            <FiEdit />
                          </button>
                          <button onClick={() => handleDelete(category._id)}>
                            <MdDelete />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {showEditForm && (
                <div className="fixed inset-0 bg-black/50 h-screen flex items-center justify-center z-[999999999] left-0">
                  <div className="lg:w-[50%] w-[95%] bg-white rounded-xl shadow-lg space-y-4 p-4 max-h-[80vh] overflow-y-auto">
                    <div className="">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium">Edit Category</h2>
                        <button
                          className="bg-red-500 w-10 h-10 rounded-full text-2xl text-white flex items-center justify-center"
                          onClick={() => setShowEditForm(false)}
                        >
                          &times;
                        </button>
                      </div>

                      <AddCategories
                        editMode={true}
                        selectedCategory={selectedCategory}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 2: Add Attribute */}
          {activeTab === 2 && (
            <motion.div
              key="Attribute"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AttributeCrud />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
