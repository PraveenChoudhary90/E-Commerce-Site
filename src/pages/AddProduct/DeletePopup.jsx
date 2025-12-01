import React from "react";
import Button from "../../components/Button";
import { BiSolidError } from "react-icons/bi";

const DeletePopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-5 space-y-5">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h4 className="lg:text-lg  md:text-base text-sm font-medium ">
                        Product Category -  <span className="text-bg-color">Asthmatic </span>
                    </h4>
                </div>
                <div className="flex items-center justify-center gap-2 text-3xl">
                    <div className="text-6xl">
                        <BiSolidError />
                    </div>
                    <h1>Warning</h1>
                </div>
                <div>
                    <h1 className="text-lg text-center">Select what you want to <span className="text-red-500 font-medium">DELETE</span> ?</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'1. Category'} />
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'2. Product Type '} />
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'3. Product Brand '} />
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'4. Product Name '} />
                </div>

                <div className="flex gap-4 items-center justify-center">
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'Cancel'} onClick={onClose} />
                    <Button bgcolor={'bg-[#FF5F5F]'} title={'Delete'} />
                </div>
            </div>
        </div>
    );
};

export default DeletePopup;
