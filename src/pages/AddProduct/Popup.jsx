import React from "react";
import Button from "../../components/Button";
import InputField from "../../components/InputField";

const Popup = ({ onClose }) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-5 space-y-5">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h4 className="lg:text-lg  md:text-base text-sm font-medium ">
                        Product Category -  <span className="text-bg-color">Asthmatic </span>
                    </h4>
                </div>
                <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1">
                    <InputField label={'Product Type'}/>
                    <InputField label={'Product Brand'}/>
                    <InputField label={'Product Name'}/>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'Cancel '} onClick={onClose}/>
                    <Button bgcolor={'bg-[#32C98D]'} title={'Save '} />
                </div>
            </div>
        </div>
    );
};

export default Popup;
