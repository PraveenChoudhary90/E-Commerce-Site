import React, { useState } from 'react';
import EmailTableComponent from './EmailTableComponent';
import { CiMail, CiStar } from 'react-icons/ci';
import { FiSend } from 'react-icons/fi';
import { ImBin } from 'react-icons/im';
import { BiError, BiPencil } from 'react-icons/bi';
import { TbMessage2Cog } from 'react-icons/tb';

const EmailPage1 = () => {
    const [activeTab, setActiveTab] = useState('Inbox');
    const labels = ["Primary", "Social", "Work", "Friends"];

    const menuItems = [
        { name: 'Inbox', icon: <CiMail />, count: 1253 },
        { name: 'Starred', icon: <CiStar />, count: 12 },
        { name: 'Sent', icon: <FiSend />, count: 2 },
        { name: 'Draft', icon: <BiPencil />, count: 1 },
        { name: 'Spam', icon: <BiError />, count: 1 },
        { name: 'Important', icon: <TbMessage2Cog />, count: 20 },
        { name: 'Bin', icon: <ImBin />, count: 2 },
    ];

    return (
        <div className="flex flex-col gap-5 lg:flex-row ">
            
            <div className="bg-white rounded-xl  p-4 w-full lg:w-1/4">
                <button className="bg-bg-color text-white px-4 py-2 rounded w-full mb-4">
                    + Compose
                </button>
                <h3 className="font-medium mb-2">My Email</h3>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.name}
                            onClick={() => setActiveTab(item.name)} // Set active tab on click
                            className={`py-2 px-3 rounded-lg flex items-center justify-between mb-2 cursor-pointer ${
                                activeTab === item.name
                                    ? 'bg-bg-color/20 text-bg-color'
                                    : 'text-gray-700'
                            }`}
                        >
                            <div className="flex gap-2 items-center">
                                {item.icon}
                                <p>{item.name}</p>
                            </div>
                            <p>{item.count}</p>
                        </li>
                    ))}
                </ul>
                <div className="mt-4">
                    <h3 className="font-medium mb-2">Label</h3>
                    {labels.map((label, index) => (
                        <div key={index} className="flex items-center gap-5">
                            <div className="w-4 h-4 border border-red-400"></div>
                            <p className="py-1 text-gray-700">{label}</p>
                        </div>
                    ))}
                    <button className="text-bg-color mt-2">+ Create New Label</button>
                </div>
            </div>

            
            <div className="flex-1">
                <EmailTableComponent activeTab={activeTab} />
            </div>
        </div>
    );
};

export default EmailPage1;
