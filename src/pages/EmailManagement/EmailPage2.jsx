import React, { useState } from 'react';
import EmailTableComponent from './EmailTableComponent';
import { CiMail, CiStar } from 'react-icons/ci';
import { FiSend } from 'react-icons/fi';
import { ImBin } from 'react-icons/im';
import { BiError, BiPencil } from 'react-icons/bi';
import { TbMessage2Cog } from 'react-icons/tb';
import { BsSaveFill } from 'react-icons/bs';
import { MdDelete, MdError } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import { LuSend } from 'react-icons/lu';
import { RiAttachmentLine } from 'react-icons/ri';
import { FaImages, FaMicrophone } from 'react-icons/fa';
import Button from '../../components/Button';

const EmailPage2 = () => {
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

    const [messages, setMessages] = useState([
        { id: 1, text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", time: "6:30 PM", sender: "received" },
        { id: 2, text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.", time: "6:34 PM", sender: "sent" },
        { id: 3, text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.", time: "6:34 PM", sender: "sent" },
        { id: 4, text: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.", time: "6:38 PM", sender: "received" },
        { id: 5, text: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.", time: "6:38 PM", sender: "received" },
    ]);

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
                            onClick={() => setActiveTab(item.name)}
                            className={`py-2 px-3 rounded-lg flex items-center justify-between mb-2 cursor-pointer ${activeTab === item.name
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
            <div className="flex-1 p-4 flex justify-between  flex-col w-full bg-white rounded-xl ">
                <div className="flex border-b py-2 justify-between items-center gap-5">
                    <div className='flex items-center gap-3'>
                        <div className='w-4 h-7 flex items-center justify-center bg-bg-color/10'>
                            <IoIosArrowBack />
                        </div>
                        <h1 className='font-medium md:text-base text-sm'>Sundram Jatav</h1>
                        <p className="bg-bg-color/10 text-xs p-1 rounded-md text-bg-color">Friend</p>
                    </div>
                    <div className="flex gap-4  text-bg-color items-center text-2xl">
                        <BsSaveFill />
                        <div className="text-red-500">
                            <MdError />
                        </div>
                        <MdDelete />
                    </div>
                </div>
                <div className="h-[70vh] overflow-y-auto p-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end w-full gap-4 mb-4 ${message.sender === "sent" ? "flex-row-reverse" : "justify-start"
                                }`}
                        >
                            <div>
                                <div className="profileImage w-10 h-10 overflow-hidden rounded-full border">
                                    <img className='w-full h-full object-cover' src="data:image/jpeg;base64,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" alt="" />
                                </div>
                            </div>
                            <div
                                className={`max-w-[70%] p-4 rounded-lg ${message.sender === "sent"
                                        ? "bg-purple-600 text-white"
                                        : "bg-bg-color1 text-gray-800"
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <span className={`text-xs ${message.sender === "sent"
                                        ? "text-white/80"
                                        : "text-gray-500"
                                    } block mt-2 text-right`}>
                                    {message.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex border-t py-2 justify-between items-center gap-5">

                    <div className="flex gap-4  items-center">
                        <div className='text-gray-400'>
                            <FaMicrophone />
                        </div>
                        <div className='w-full'>
                            <input className='py-1 px-1 outline-none' type="text" placeholder='write...' />
                        </div>
                    </div>
                    <div className="flex gap-4  items-center">
                        <RiAttachmentLine />
                        <FaImages />
                        
                        <Button title={'Send '} icon={<LuSend />} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailPage2;
