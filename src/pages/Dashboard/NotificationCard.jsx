import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Button from "../../components/Button";

const NotificationCard = ({
    title,
    description,
    severity,
    status,
    dateTime,
    admin,
}) => {
    const statusClasses = {
        New: "bg-blue-500 text-white",
        Seen: "bg-green-500 text-white",
        UnSeen: "bg-yellow-500 text-black",
    };

    return (
        <>
        
         <div className="bg-white p-4 rounded-xl border border-[#EFF0F6] space-y-3">
            <div className="flex flex-wrap gap-3 justify-between items-center ">
                <div className="flex gap-2 items-center">
                    <h2 className="font-medium md:text-lg">{}</h2>
                    <span
                        className={`px-2 py-1 text-white text-xs rounded-md ${statusClasses[status]}`}
                    >
                        {status}
                    </span>
                </div>
                <div className="flex gap-2 text-sm">
                    <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        <FaEye className="text-blue-500" />
                    </button>
                    <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        <FaEdit className="text-green-500" />
                    </button>
                    <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        <FaTrash className="text-red-500" />
                    </button>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-gray-600 text-sm mb-4">{description}</p>
                <p className="text-red-600 font-medium text-sm mb-2">
                    {severity}
                </p>
                <div className="flex gap-2 items-center justify-between">
                    <p className="text-gray-500 text-xs">{admin}</p>
                    <p className="text-gray-500 text-xs">{dateTime}</p>
                </div>
            </div>
        </div>
        </>
       
    );
};

const Notifications = () => {
    const notifications = [
        {
            title: "Franchisee Management",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco",
            severity: "High Severity",
            status: "New",
            dateTime: "04/07/2025 3:00am",
            admin: "Reverification cancel by Admin",
        },
        {
            title: "Franchisee Management",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco",
            severity: "High Severity",
            status: "Seen",
            dateTime: "04/07/2025 3:00am",
            admin: "Reverification cancel by Admin",
        },
        {
            title: "Franchisee Management",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco",
            severity: "High Severity",
            status: "UnSeen",
            dateTime: "04/07/2025 3:00am",
            admin: "Reverification cancel by Admin",
        },
        {
            title: "Franchisee Management",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco",
            severity: "High Severity",
            status: "UnSeen",
            dateTime: "04/07/2025 3:00am",
            admin: "Reverification cancel by Admin",
        },
    ];

    return (
        <div className="bg-white rounded-xl p-4">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">
                    Notification & Alert List
                </h1>

                <Button title={"View All"} link={'/notification'} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notifications.map((notification, index) => (
                    <NotificationCard key={index} {...notification} />
                ))}
            </div>
        </div>
    );
};

export default Notifications;
