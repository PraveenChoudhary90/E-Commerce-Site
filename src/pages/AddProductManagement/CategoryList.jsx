// src/pages/category/CategoryListPage.jsx

import { useEffect, useState } from "react";
import { getCategoryList } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);     
  const [groups, setGroups] = useState({});            
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getCategoryList();
        console.log("getCategoryList response:", res);

        
        const items = Array.isArray(res?.categories) ? res.categories : [];

        
        const grouped = items.reduce((acc, item) => {
          const key = item.name || "Uncategorized";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {}); 

        setCategories(items);
        setGroups(grouped);

        
        const firstKey = Object.keys(grouped)[0] || "";
        setSelectedCategory(firstKey);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryNames = Object.keys(groups);
  const rows = groups[selectedCategory] || [];

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    
      <header className="py-8">
        <h1 className="text-3xl font-semibold text-center text-gray-900">
          {selectedCategory || "Products"}
        </h1>
      </header>

     
      <main className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex gap-8">
         
          <aside className="w-64 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold text-purple-700 mb-4">
              Product Categories
            </h2>

            {categoryNames.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found.</p>
            ) : (
              <ul className="space-y-1">
                {categoryNames.map((cat) => {
                  const active = cat === selectedCategory;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded border-b last:border-b-0
                          ${
                            active
                              ? "font-semibold text-purple-700"
                              : "text-gray-800 hover:text-purple-700"
                          }`}
                      >
                        {cat}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          
          <section className="flex-1">
           
            <div className="mb-4 bg-gray-100 rounded-lg px-4 py-3 text-gray-700">
              Search by Brand, Molecule &amp; Therapeutic Role
            </div>

            <div className="bg-bg-color1 shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-700 text-white text-sm">
                      <th className="py-3 px-4 text-left">PARTICULARS</th>
                      <th className="py-3 px-4 text-left">COMPOSITION</th>
                      <th className="py-3 px-4 text-left">PACKING</th>
                      <th className="py-3 px-4 text-left">TYPE</th>
                      <th className="py-3 px-4 text-left">
                        THERAPEUTIC ROLE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 px-4 text-center text-gray-500"
                        >
                          No products found in this category.
                        </td>
                      </tr>
                    )}

                    {rows.map((item, idx) => (
                      <tr
                        key={item._id || idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.particulars || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.composition || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.packing || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.type || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.therapeutic_role || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CategoryListPage;
