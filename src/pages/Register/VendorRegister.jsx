import React, { useState } from 'react';
import { MainContent } from '../../constants/mainContent';
import Footer from '../../components/Footer';

const VendorRegister = () => {
    const [formData, setFormData] = useState({
        vendorName: '',
        primaryContact: '',
        secondaryContact: '',
        email: '',
        designation: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        companyName: '',
        businessType: '',
        gstin: '',
        nocExpiryDate: '',
        mcaExpiryDate: '',
    });

    const [popupVisible, setPopupVisible] = useState(false);
    const [formValid, setFormValid] = useState(true);
    const [formDataForPopup, setFormDataForPopup] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        // Validate form data here
        const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');
        setFormValid(allFieldsFilled);
        return allFieldsFilled;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Set form data for popup
            setFormDataForPopup(formData);
            // Show the popup
            setPopupVisible(true);
        } else {
            // Show error or alert
            alert('Please fill in all the fields.');
        }
    };

    return (
        <div className="px-6 pt-6 bg-[#F9F9F9]">
            <div className="space-y-7">
                <div className='flex items-center justify-between'>
                    <img
                        src={MainContent.logo}
                        alt="Pharama Logo"
                        className="md:w-[160px] w-[100px] h-auto"
                    />
                    <h1 className='md:text-2xl sm:text-xl font-medium text-bg-color'>Register as Vendor</h1>
                </div>

                <div className='after:absolute after:top-0 after:w-full after:hidden md:after:block after:h-20 after:bg-bg-color after:rounded-xl relative'>
                    <div className='flex md:flex-row gap-5 md:gap-0 flex-col relative z-50 md:p-4'>
                        <div>
                            <h2 className="text-lg md:text-center font-medium text-bg-color md:text-white">General Detail Franchisee</h2>
                        </div>
                        <div className='w-full bg-white rounded-xl p-6'>
                            <section className="">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Input label="Vendor Name*" name="vendorName" value={formData.vendorName} onChange={handleInputChange} placeholder="Enter Franchisee Name" />
                                    <Input type="file" label="Upload Aadhar Card*" />
                                    <Input type="file" label="Upload PAN*" />
                                    <Input label="Primary Contact Number*" name="primaryContact" value={formData.primaryContact} onChange={handleInputChange} placeholder="Primary Contact Number" />
                                    <Input label="Secondary Contact Number*" name="secondaryContact" value={formData.secondaryContact} onChange={handleInputChange} placeholder="Secondary Contact Number" />
                                    <Input label="Email*" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" />
                                    <Input label="Designation of Vendor*" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="Enter Designation" />
                                    <Select label="Country*" name="country" options={["Choose", "India"]} value={formData.country} onChange={handleInputChange} />
                                    <Input label="State*" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter State" />
                                    <Input label="City*" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter City" />
                                    <Input label="Pincode/Zipcode*" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter Pincode" />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <div className='after:absolute after:top-0 after:w-full after:hidden md:after:block after:h-20 after:bg-bg-color after:rounded-xl relative'>
                    <div className='flex md:flex-row gap-5 md:gap-0 flex-col relative z-50 md:p-4'>
                        <div>
                            <h2 className="text-lg md:text-center font-medium text-bg-color md:text-white">Company / Shop Details</h2>
                        </div>

                        <div className='w-full bg-white rounded-xl p-6'>
                            <section className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Input label="Company/Shop Name*" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter Company/Shop Name" />
                                    <Select label="Business Type*" name="businessType" options={["Choose", "Retail", "Wholesale"]} value={formData.businessType} onChange={handleInputChange} />
                                    <Input type="file" label="Upload MCA*" />
                                    <Input label="MCA Expiry Date*" type="date" name="mcaExpiryDate" value={formData.mcaExpiryDate} onChange={handleInputChange} />
                                    <Input label="Primary Contact Email*" name="primaryEmail" value={formData.primaryEmail} onChange={handleInputChange} placeholder="Enter Email" />
                                    <Input label="Secondary Contact Number*" name="secondaryContactNumber" value={formData.secondaryContactNumber} onChange={handleInputChange} placeholder="Enter Contact Number" />
                                    <Input label="GSTIN*" name="gstin" value={formData.gstin} onChange={handleInputChange} placeholder="Enter GSTIN" />
                                    <Input type="file" label="Upload GST Certificate" />
                                    <Input label="NOC Expiry Date*" type="date" name="nocExpiryDate" value={formData.nocExpiryDate} onChange={handleInputChange} />
                                    <Input type="file" label="Upload Business Address Proof*" />
                                    <Input label="State*" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter State" />
                                    <Input label="City*" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter City" />
                                    <Input label="Pincode/Zipcode*" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter Pincode" />
                                </div>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-medium text-bg-color mb-4">Declaration</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    I We declare and confirm that all information and attachments submitted in this application are true and
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
                                <button onClick={handleSubmit} className="px-4 py-2 bg-bg-color text-white rounded-md hover:bg-bg-color">
                                    Submit Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>

            {/* Popup */}
            {popupVisible && (
                <div className="fixed z-[999999999] inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 space-y-5 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-medium mb-4">Check Your Details!</h2>
                        <div>
                            <h2 className="text-lg font-medium text-bg-color">Company / Shop Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input label="Franchisee Name*" name="vendorName" value={formDataForPopup.vendorName} placeholder="Enter Franchisee Name" />
                            <Input type="file" label="Upload Aadhar Card*" />
                            <Input type="file" label="Upload PAN*" />
                            <Input label="Email*" name="email" value={formDataForPopup.email} onChange={handleInputChange} placeholder="Enter Email" />
                            <Input label="Designation of Franchisee*" name="designation" value={formDataForPopup.designation} onChange={handleInputChange} placeholder="Enter Designation" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-bg-color">Company / Shop Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input label="Company/Shop Name*" name="companyName" value={formDataForPopup.companyName} onChange={handleInputChange} placeholder="Enter Company/Shop Name" />
                            <Select label="Business Type*" name="businessType" options={["Choose", "Retail", "Wholesale"]} value={formDataForPopup.businessType} onChange={handleInputChange} />
                            <Input type="file" label="Upload MCA*" />
                            <Input label="MCA Expiry Date*" type="date" name="mcaExpiryDate" value={formDataForPopup.mcaExpiryDate} onChange={handleInputChange} />
                            <Input label="GSTIN*" name="gstin" value={formDataForPopup.gstin} onChange={handleInputChange} placeholder="Enter GSTIN" />
                            <Input type="file" label="Upload GST Certificate" />
                            <Input label="NOC Expiry Date*" type="date" name="nocExpiryDate" value={formDataForPopup.nocExpiryDate} onChange={handleInputChange} />
                            <Input type="file" label="Upload Business Address Proof*" />
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setPopupVisible(false)}
                                className="px-4 py-2 bg-bg-color text-white rounded-md hover:bg-bg-color"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setPopupVisible(false)}
                                className="px-4 py-2 bg-bg-color text-white rounded-md hover:bg-bg-color"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Input = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="text-sm font-medium  text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="p-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-color"
        />
    </div>
);

const Select = ({ label, name, options, value, onChange }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="text-sm text-gray-700 mb-2">{label}</label>
        <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-color"
        >
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default VendorRegister;
