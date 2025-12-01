import React from "react";
import { MainContent } from "../../constants/mainContent";
import Footer from "../../components/Footer";

const VerifyBankDetails = () => {
    return (
        <div className="px-6 pt-6 bg-[#F9F9F9] min-h-screen">
            <div className="space-y-7 ">
                <div className='flex items-center justify-between'>
                    <img
                        src={MainContent.logo}
                        alt="Bionova Logo"
                        className="md:w-[160px] w-[100px] h-auto"
                    />
                    <h1 className='md:text-2xl sm:text-xl font-medium text-bg-color'>Verify Bank Details</h1>
                </div>
                <div className='after:absolute after:top-0 after:w-full after:hidden md:after:block after:h-20 after:bg-bg-color after:rounded-xl relative '>
                    <div className="flex md:flex-row gap-5 md:gap-0 flex-col relative z-50 md:p-4">
                        <div>
                            <h2 className="text-lg md:text-center font-medium text-bg-color md:text-white">Verify Bank Details</h2>
                        </div>
                        <div className="w-full bg-white rounded-xl p-6">
                            <section className="">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Input label="Bank Name*" placeholder="Enter Bank Name" />
                                    <Input label="Bank A/c No*" placeholder="Enter A/c Number" />
                                    <Input label="Bank Branch*" placeholder="Enter Branch Name" />
                                    <Input label="IFSC Code*" placeholder="Enter IFSC Code" />
                                    <Input label="Bank A/c Holder Name*" placeholder="Enter Holder Name" />
                                    <Input type="file" label="Upload front page of passbook*" />
                                    <Input label="Email*" placeholder="Enter Email" />
                                    <Input label="Mobile No*" placeholder="Enter Mobile Number" />
                                    <Input label="GST No" placeholder="Enter GST Number" />
                                    <Select label="Country*" options={["Choose", "India"]} />
                                    <Input label="Pincode/Zipcode*" placeholder="Enter Pincode" />
                                    <Input type="file" label="Upload PAN*" />
                                </div>
                            </section>

                            <section className="mt-6">
                                <h2 className="text-lg font-medium text-bg-color mb-4">Declaration</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    I/We declare and confirm that all information and attachments submitted in this application are true and
                                    correct. I/We are aware that any false information provided herein will result in the rejection of my/our
                                    application and cancellation of any registration granted.
                                </p>
                                <div className="flex items-center">
                                    <input type="checkbox" id="agree" className="w-4 h-4 text-bg-color focus:ring-0 mr-2" />
                                    <label htmlFor="agree" className="text-sm text-gray-700">
                                        I Agree
                                    </label>
                                </div>
                            </section>

                            <div className="flex justify-end space-x-4">
                                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                                <button className="px-4 py-2 bg-bg-color text-white rounded-md">
                                    Submit Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div >
    );
};

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div>
        <label className="text-sm font-medium  text-gray-700 mb-1">{label}</label>
        <input
            placeholder={label}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 text-sm block w-full bg-bg-color1/50 border-gray-300 rounded-md shadow-sm border p-2 outline-none"
        />
    </div>
);


const Select = ({ label, options }) => (
    <div>
        <label className="block text-sm text-gray-600 mb-1">{label}</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);


export default VerifyBankDetails;
