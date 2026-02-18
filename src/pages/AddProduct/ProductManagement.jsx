import { useState } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { IoMdAdd } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import Popup from "./Popup";
import DeletePopup from "./DeletePopup";

const ProductManagement = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const openPopup = () => setPopupOpen(true);
    const closePopup = () => setPopupOpen(false);

    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
    const openDeletePopup = () => setDeletePopupOpen(true);
    const closeDeletePopup = () => setDeletePopupOpen(false);

    const Asthmatic = [
        {
            type: "Pill",
            brand: "Rivo Healthcare Limited",
            names: ["INH AIRFLOW 250", "Galaxy 250"],
        },
        {
            type: "Capsule",
            brand: "Astra Healthcare Limited",
            names: ["INH AIRFLOW 250", "INH AIRFLOW 500"],
        },
        {
            type: "Tablet",
            brand: "Rigil Healthcare Limited",
            names: ["INH CARDI 250", "INH CARDI 500"],
        },
        {
            type: "Pill",
            brand: "Rivo Healthcare Limited",
            names: ["INH AIRFLOW 250", "Galaxy 250"],
        },
        {
            type: "Capsule",
            brand: "Astra Healthcare Limited",
            names: ["INH AIRFLOW 250", "INH AIRFLOW 500"],
        },
    ]
    const Cardiology = [
        {
            type: "Tablet",
            brand: "Rigil Healthcare Limited",
            names: ["INH CARDI 250", "INH CARDI 500"],
        },
        {
            type: "Pill",
            brand: "Pharama Satti Private Limited",
            names: ["INH AIRFLOW 250", "Galaxy 250"],
        },
        {
            type: "Capsule",
            brand: "Astra Healthcare Limited",
            names: ["INH AIRFLOW 250", "INH AIRFLOW 500"],
        },
        {
            type: "Tablet",
            brand: "Rigil Healthcare Limited",
            names: ["INH CARDI 250", "INH CARDI 500"],
        },
    ]

    return (
        <div className="space-y-7">
            <div className="bg-white shadow-md rounded-xl p-5 space-y-3">
                <h3 className="md:text-lg sm:text-base text-sm font-medium">Add Products - Category / Type / Brand / Name</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                    <div className="space-y-2">
                        <InputField type="text" placeholder={'Asthmatic'} label={'Product Category'} />
                        <div className="flex gap-4 items-center justify-end ">
                            <Button bgcolor={'bg-[#2C6AE5]'} title={'View Image'} icon={<IoEyeOutline />
                            } />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add Image'} icon={<IoMdAdd />} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <InputField type="text" placeholder={'Pill'} label={'Product Type'} />
                        <div className="flex gap-4 items-center justify-end ">
                            <Button bgcolor={'bg-[#2C6AE5]'} title={'View Image'} icon={<IoEyeOutline />
                            } />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add Image'} icon={<IoMdAdd />} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <InputField type="text" placeholder={'Rivo Healthcare Limited'} label={'Brand'} />
                        <div className="flex gap-4 items-center justify-end ">
                            <Button bgcolor={'bg-[#2C6AE5]'} title={'View Image'} icon={<IoEyeOutline />
                            } />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add Image'} icon={<IoMdAdd />} />
                        </div>
                    </div>
                    <div className="space-y-3 flex flex-col">
                        <div className="space-y-2">
                            <InputField type="text" placeholder={'INH AIRFLOW 250'} label={'Product Name'} />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add Details'} icon={<IoMdAdd />} />
                        </div>
                        <div className="space-y-2">
                            <InputField type="text" placeholder={'INH AIRFLOW 250'} label={'Product Name'} />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add Details'} icon={<IoMdAdd />} />
                        </div>
                        <div className="space-y-2">
                            <InputField type="text" placeholder={'INH AIRFLOW 250'} label={'Product Name'} />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add Details'} icon={<IoMdAdd />} />
                        </div>

                        <div className="">
                            <Button bgcolor={'bg-[#2C6AE5]'} icon={<IoMdAdd />} title={'Add More'} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <Button bgcolor={'bg-[#2C6AE5]'} title={'Cancel Product'} />
                    <Button bgcolor={'bg-[#32C98D]'} title={'Save Product'} />
                </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 space-y-6">
                <h3 className="text-xl font-medium">Already Created Category List</h3>
                <div className="bg-bg-color1/80 rounded-md p-2 space-y-3">
                    <div className="flex flex-wrap items-center gap-5 justify-between">
                        <h4 className="lg:text-lg  md:text-base text-sm font-medium ">
                            Product Category -  <span className="text-bg-color">Asthmatic</span>
                        </h4>
                        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-2 sm:grid-cols-2 grid-cols-1">
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add More Type'} onClick={openPopup} />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add More Brand'} onClick={openPopup}/>
                            <Button bgcolor={'bg-[#2C6AE5]'} title={'Add More Product'} onClick={openPopup}/>
                            <Button bgcolor={'bg-[#FF5F5F]'} title={'Delete'} onClick={openDeletePopup} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">

                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Product Type</th>
                                    <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Product Brand</th>
                                    <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Product Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Asthmatic.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{item.type}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{item.brand}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{item.names}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-bg-color1/80 rounded-md p-2 space-y-3">
                    <div className="flex flex-wrap items-center gap-5 justify-between">
                        <h4 className="lg:text-lg  md:text-base text-sm font-medium ">
                            Product Category -  <span className="text-bg-color"> Cardiology</span>
                        </h4>

                        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-2 sm:grid-cols-2 grid-cols-1">
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add More Type'} onClick={openPopup} />
                            <Button bgcolor={'bg-[#32C98D]'} title={'Add More Brand'} onClick={openPopup} />
                            <Button bgcolor={'bg-[#2C6AE5]'} title={'Add More Product'} onClick={openPopup}/>
                            <Button bgcolor={'bg-[#FF5F5F]'} title={'Delete'} onClick={openDeletePopup} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">

                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Product Type</th>
                                    <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Product Brand</th>
                                    <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Product Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Cardiology.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{item.type}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{item.brand}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{item.names}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isPopupOpen && <Popup onClose={closePopup} />}
            {isDeletePopupOpen && <DeletePopup onClose={closeDeletePopup} />}
        </div>
    );
};

export default ProductManagement;
