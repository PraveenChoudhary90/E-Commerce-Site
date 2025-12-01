import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import productImg from '../../assets/inventorymanagement/productImg.jpg'
import { MdAddCircleOutline, MdDelete, MdError } from "react-icons/md";
import { BsSaveFill } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { Link } from "react-router-dom";
const EmailTableComponent = ({ tittle }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const data = [
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sundram Jatav",
            type: "Primary",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Abhay Gautam",
            type: "Work",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
        {
            name: "Sateesh Kumar",
            type: "Friend",
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, vero.",
            time: '8:25 AM'
        },
    ]

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="p-5 space-y-5 bg-white rounded-xl  overflow-hidden">

            <div className="flex justify-between items-center gap-5">
                <input
                    type="text"
                    placeholder="Search List"
                    className="w-full lg:w-1/2 p-2 px-5 border border-gray-300 rounded-full outline-none text-sm"
                />
                <div className="flex gap-4 text-bg-color items-center text-2xl">
                    <BsSaveFill />
                    <div className="text-red-500">
                        <MdError />
                    </div>
                    <MdDelete />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        {/* <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">SL</th>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Type</th>
                            <th className="border border-gray-300 p-2">Text</th>
                            <th className="border border-gray-300 p-2">Time</th>
                        </tr> */}
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <Link to={'/email-message'}>
                                <tr key={index} className="hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                                    <td className="py-4 p-1"><input type="checkbox" /></td>
                                    <td className="py-4 p-1 text-xl">
                                        <CiStar />
                                    </td>
                                    {/* <td className="py-4 p-1">{(currentPage - 1) * rowsPerPage + index + 1}</td> */}
                                    <td className="py-4 p-1">{item.name}</td>
                                    <td className="py-4 p-1">
                                        <p className="bg-bg-color/10 text-xs p-1 rounded-md text-bg-color">{item.type}</p>
                                    </td>
                                    <td className="py-4 p-1 text-xs">{item.text}</td>
                                    <td className="py-4 p-1">{item.time}</td>
                                </tr>
                            </Link>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                    Rows per page: {rowsPerPage}
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-2 py-1 border rounded ${currentPage === i + 1 ? "bg-bg-color text-white" : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailTableComponent;
