import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getSellerListToVerify } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import SelectComponent from "../../components/SelectComponent";

/* 🇮🇳 India States List */
const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const VendorList = ({ tittle }) => {
  const navigate = useNavigate();

  const [sellerList, setSellerList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    country: "India",
    state: "",
    city: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  /* Fetch Vendor List */
  useEffect(() => {
    fetchSellerList();
  }, []);

  const fetchSellerList = async () => {
    try {
      setIsLoading(true);
      const res = await getSellerListToVerify();
      setSellerList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* Handle Filters */
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  /* Filtering Logic (Backend safe) */
  const filteredData = sellerList.filter((item) => {
    const matchesSearch =
      item.vendorName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.companyName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.franchiseeId?.toLowerCase().includes(searchInput.toLowerCase());

    const matchesCountry = filters.country
      ? item.country?.toLowerCase() === filters.country.toLowerCase()
      : true;

    const matchesState = filters.state
      ? item.state?.toLowerCase() === filters.state.toLowerCase()
      : true;

    const matchesCity = filters.city
      ? item.city?.toLowerCase().includes(filters.city.toLowerCase())
      : true;

    return matchesSearch && matchesCountry && matchesState && matchesCity;
  });

  const displayData =
    filters.state || filters.city || searchInput
      ? filteredData
      : sellerList;

  /* Pagination */
  const totalPages = Math.ceil(displayData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = displayData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  /* Navigate */
  const handleNavigateToVendorDetails = (item) => {
    navigate(`/franchisee-details/${item._id}`, { state: item });
  };

  return (
    <>
      {isLoading && <PageLoader />}

      <div className="space-y-7">
        <div className="p-5 bg-white rounded-xl space-y-5">

          {/* 🔍 Search */}
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-medium text-gray-800">{tittle}</h2>
            <input
              type="text"
              placeholder="Search Franchisee / ID / Company"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* 🎯 Filters */}
          <div className="p-5 border rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium">Filter Data</h3>

            <form className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">

              {/* Country */}
              <SelectComponent
                label="Country"
                value={filters.country}
                options={[{ value: "India", label: "India" }]}
                onChange={(e) =>
                  handleFilterChange("country", e.target.value)
                }
              />

              {/* State */}
              <SelectComponent
                label="State"
                value={filters.state}
                options={[
                  { value: "", label: "-- Select State --" },
                  ...INDIA_STATES.map((s) => ({
                    value: s,
                    label: s,
                  })),
                ]}
                onChange={(e) =>
                  handleFilterChange("state", e.target.value)
                }
              />

              {/* City Input */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={filters.city}
                  onChange={(e) =>
                    handleFilterChange("city", e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </form>
          </div>

          {/* 📋 Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">SL</th>
                  <th className="border p-2">Franchisee</th>
                  <th className="border p-2">Franchisee ID</th>
                  <th className="border p-2">Company</th>
                  <th className="border p-2">KYC Status</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={item._id}>
                    <td className="border p-2 text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="border p-2 capitalize">
                      {item.vendorName}
                    </td>
                    <td className="border p-2 text-center">
                      {item.franchiseeId}
                    </td>
                    <td className="border p-2 capitalize">
                      {item.companyName}
                    </td>
                    <td
                      className={`border p-2 text-center font-medium ${
                        item.kycStatus === "approved"
                          ? "text-green-600"
                          : item.kycStatus === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.kycStatus}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() =>
                          handleNavigateToVendorDetails(item)
                        }
                        className="p-2 rounded bg-bg-color/10 text-bg-color"
                      >
                        <FaRegEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
          <div className="flex justify-between items-center">
            <span>Rows per page: {rowsPerPage}</span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-bg-color text-white"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorList;
