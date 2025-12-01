import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import productImg from "../../assets/inventorymanagement/productImg.jpg";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import SelectComponent from "../../components/SelectComponent";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import VendorManagementForm from "./VendorManagementForm";
import { Link, useNavigate } from "react-router-dom";
import { getSellerListToVerify, switchVendorToPromoter } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import styled from 'styled-components';
import Swal from "sweetalert2";

const VendorList = ({ tittle }) => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [sellerList, setSellerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
const navigate = useNavigate()

    useEffect(() => {
        getSellerList();
    }, []);

    const getSellerList = async () => {
        try {
            setIsLoading(true);
            const response = await getSellerListToVerify();
            setSellerList(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
   
    const filteredData = sellerList?.filter(
        (item) =>
            item.name?.username
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item.shopdetails?.shopname
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item._id.toLowerCase().includes(searchInput.toLowerCase())
    );

    // useEffect(() => {
    //     if (data && data.length) {
    //         const timer = setTimeout(() => setIsLoading(false), 1000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [data]);

    const totalPages = Math.ceil(sellerList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const handleNavigateToVendorDetails=(item)=>{
        navigate(`/franchisee-details/${item._id}`, { state: item })
    }

    const switchToPromoter = async (id, status) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: `Franchisee will be ${status ? "removed" : "marked"} as Promoter`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${status ? "remove" : "mark"} as Promoter!`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setIsLoading(true);
                        await switchVendorToPromoter(id)
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: `Franchisee has been ${status ? "removed" : "marked"} as Promoter`,
                        })
                        getSellerList();
                    } catch (error) {
                        console.log(error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Something went wrong",
                        });
                    } finally {
                        setIsLoading(false);
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {isLoading && <PageLoader />}
            <div className="space-y-7">
                <div className="p-5 bg-white rounded-xl overflow-hidden space-y-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-gray-800">
                            {tittle}
                        </h2>
                        <div className="">
                            <input
                                type="text"
                                placeholder="Search Franchisee"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="p-5 bg-white rounded-xl border shadow-lg overflow-hidden space-y-3">
                        <h1 className="text-xl font-medium text-gray-800">
                            Filter Data
                        </h1>
                        <div>
                            <form
                                action=""
                                className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 grid-cols-1"
                            >
                                <div className="space-y-2">
                                    <SelectComponent
                                        label="Select Year"
                                        options={[
                                            {
                                                value: "-- Select Year --",
                                                label: "-- Select Year --",
                                            },
                                            { value: "2020", label: "2020" },
                                            { value: "2021", label: "2021" },
                                            { value: "2022", label: "2022" },
                                            { value: "2023", label: "2023" },
                                            { value: "2024", label: "2024" },
                                            { value: "2025", label: "2025" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <SelectComponent
                                        label="Select Month"
                                        options={[
                                            {
                                                value: "-- Select Month --",
                                                label: "-- Select Month --",
                                            },
                                            { value: "Jan", label: "Jan" },
                                            { value: "Feb", label: "Feb" },
                                            { value: "Mar", label: "Mar" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <InputField
                                        label={"Select Date"}
                                        placeholder={"04/05/2024"}
                                        type="date"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                            <thead>
                                <tr className="">
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        SL
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Franchisee
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Franchisee ID
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Company/Shop Name
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Verification Status
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Action
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Mark as promoter
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? paginatedData.map((_, index) => (
                                          <tr
                                              key={index}
                                              className="animate-pulse"
                                          >
                                              <td className="border border-gray-300 p-2 text-center">
                                                  <div className="h-4 bg-gray-300 rounded w-6 mx-auto"></div>
                                              </td>
                                              <td className="border border-gray-300 p-2 text-center">
                                                  <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                                              </td>
                                              <td className="border border-gray-300 p-2 text-center">
                                                  <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                                              </td>
                                              <td className="border border-gray-300 p-2 text-center">
                                                  <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                                              </td>
                                              <td className="border border-gray-300 p-2 text-center">
                                                  <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                                              </td>
                                              <td className="border border-gray-300 p-2 text-center">
                                                  <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
                                              </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                          </tr>
                                      ))
                                    : paginatedData.map((item, index) => (
                                          <tr key={index} className="">
                                              <td className="border border-gray-300 p-2 font-light text-center">
                                                  {(currentPage - 1) *
                                                      rowsPerPage +
                                                      index +
                                                      1}
                                              </td>
                                              <td className="border border-gray-300 p-2 font-light text-start capitalize">
                                                  {item.name?.username}
                                              </td>
                                              <td className="border border-gray-300 p-2 font-light text-center">
                                                  {item._id}
                                              </td>
                                              <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                  {item.shopdetails?.shopname}
                                              </td>
                                              <td
                                                  className={`border border-gray-300 p-2 text-center capitalize ${
                                                      item.isVendorVerified ===
                                                      "pending"
                                                          ? "text-yellow-500"
                                                          : item.VerificationStatus ===
                                                        "approved"
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                  }`}
                                              >
                                                  {item.isVendorVerified}
                                              </td>

                                              <td
                                                  className={`p-2 border border-gray-300 text-center`}
                                              >
                                                  <div className="flex gap-2 items-center justify-center">

                                                      <button onClick={()=>handleNavigateToVendorDetails(item)}
                                                          className="p-2 rounded text-bg-color bg-bg-color/10 cursor-pointer"
                                                      >
                                                          <FaRegEye />
                                                      </button>     
                                                      {/* <button className="p-2 rounded text-bg-color bg-bg-color/10">
                                                      <RiDeleteBin6Line />
                                                  </button> */}
                                                  </div>
                                              </td>
                                            <td
                                                className={`p-2 border border-gray-300 text-center`}
                                            >
                                                <div className="flex gap-2 items-center justify-center">
                                                    <button className="p-2 rounded text-bg-color bg-bg-color/10 cursor-pointer" onClick={() => switchToPromoter(item._id, item.isPromoter)}>
                                                        {item.isPromoter ? (
                                                            <span className="text-green-500">
                                                                Promoter
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-500">
                                                                Switch to Promoter
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center ">
                        <span className="text-gray-600">
                            Rows per page: {rowsPerPage}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-2 py-1 border rounded ${
                                        currentPage === i + 1
                                            ? "bg-bg-color text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                className="px-2 py-1 border rounded hover:bg-gray-100"
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

const StyledWrapper = styled.div`
  .checkbox-wrapper-46 input[type="checkbox"] {
    display: none;
    visibility: hidden;
  }

  .checkbox-wrapper-46 .cbx {
    margin: auto;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
  }
  .checkbox-wrapper-46 .cbx span {
    display: inline-block;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-46 .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    transform: scale(1);
    vertical-align: middle;
    border: 1px solid #9098a9;
    transition: all 0.2s ease;
  }
  .checkbox-wrapper-46 .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #ffffff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-46 .cbx span:first-child:before {
    content: "";
    width: 100%;
    height: 100%;
    background: #506eec;
    display: block;
    transform: scale(0);
    opacity: 1;
    border-radius: 50%;
  }
  .checkbox-wrapper-46 .cbx span:last-child {
    padding-left: 8px;
  }
  .checkbox-wrapper-46 .cbx:hover span:first-child {
    border-color: #506eec;
  }

  .checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child {
    background: #506eec;
    border-color: #506eec;
    animation: wave-46 0.4s ease;
  }
  .checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  .checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child:before {
    transform: scale(3.5);
    opacity: 0;
    transition: all 0.6s ease;
  }

  @keyframes wave-46 {
    50% {
      transform: scale(0.9);
    }
  }`;