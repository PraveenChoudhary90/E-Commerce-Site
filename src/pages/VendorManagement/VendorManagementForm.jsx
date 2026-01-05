import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import Section from "../../components/Section";
import Button from "../../components/Button";
import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";
import { useLocation, useParams } from "react-router-dom";
import ImageViewField from "../../components/ImageViewField";
import { updateVendorStatus } from "../../api/auth-api";
import Swal from "sweetalert2";

const VendorManagementForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const userInfo = location.state;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: "",
    primaryContact: "",
    secondaryContact: "",
    email: "",
    designation: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    companyName: "",
    businessType: "",
    gstin: "",
    adharCardImg: "",
    panCardImg: "",
    gstCertificateImg: "",
    businessAddressImg: "",
    businessEmail: "",
    businessMobile: "",
    aadharNo: "",
    pancardNo: "",
    address: "",
    businessPancardNo: "",
    businessPanCardImg: "",

    holdername: "",
    branchName: "",
    bankname: "",
    passbook: "",
    accountNumber: "",
    ifsccode: "",

    kycStatus: "pending", // Add this
  });

  useEffect(() => {
    setFormData({
      ...formData,
      vendorName: userInfo?.vendorName || "",
      primaryContact: userInfo?.primaryContact || "",
      secondaryContact: userInfo?.secondaryContact || "",
      email: userInfo?.email || "",
      designation: userInfo?.designation || "",
      country: "India",
      state: userInfo?.state || "",
      city: userInfo?.city || "",
      pincode: userInfo?.pincode || "",
      companyName: userInfo?.companyName || "",
      businessType: userInfo?.businessType || "",
      aadharNo: userInfo?.aadharNo || "",
      adharCardImg: userInfo?.adharCardImg || "",
      pancardNo: userInfo?.pancardNo || "",
      panCardImg: userInfo?.panCardImg || "",
      businessAddressImg: userInfo?.businessAddressImg || "",
      address: userInfo?.address || "",
      businessEmail: userInfo?.businessEmail || "",
      businessMobile: userInfo?.businessMobile || "",
      gstin: userInfo?.gstin || "",
      gstCertificateImg: userInfo?.gstCertificateImg || "",
      businessPancardNo: userInfo?.businessPancardNo || "",
      businessPanCardImg: userInfo?.businessPanCardImg || "",
      holdername: userInfo?.holdername || "",
      branchName: userInfo?.branchName || "",
      bankname: userInfo?.bankname || "",
      passbook: userInfo?.passbook || "",
      accountNumber: userInfo?.accountNumber || "",
      ifsccode: userInfo?.ifsccode || "",
      kycStatus: userInfo?.kycStatus || "pending", // Add this
    });
  }, []);

  const StatusHandler = async (status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `User will be marked as ${status}`,
      icon:
        status === "approved"
          ? "success"
          : status === "pending"
          ? "info"
          : "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, mark as ${status}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let reason = "";

        if (status === "rejected") {
          const { value: rejectionReason } = await Swal.fire({
            title: "Enter Rejection Reason",
            input: "text",
            inputPlaceholder: "Enter reason...",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
              if (!value) {
                return "You need to provide a reason!";
              }
            },
          });

          if (!rejectionReason) return;
          reason = rejectionReason;
        }

        try {
          setIsLoading(true);
          await updateVendorStatus(id, status, reason);

          // Update local state so buttons hide immediately
          setFormData((prev) => ({ ...prev, kycStatus: status }));

          Swal.fire({
            title: `${status.charAt(0).toUpperCase() + status.slice(1)}!`,
            text: `Member has been marked as ${status}.`,
            icon: "success",
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="space-y-7">
        <div className="min-h-screen bg-white rounded-3xl">
          {/* general details section */}
          <Section title="General Details">
            <InputField
              label="Vendor Name*"
              name="vendorName"
              value={formData.vendorName}
              placeholder="Enter Vendor Name"
            />
            <InputField
              disabled
              label="Aadhar Number*"
              name="aadharNo"
              value={formData.aadharNo}
              placeholder="Aadhar Number"
              minLength="12"
              maxLength="12"
            />
            <ImageViewField image={formData?.adharCardImg} title={"Aadhar Card"} />
            <InputField
              disabled
              label="Pancard Number*"
              name="pancardNo"
              value={formData.pancardNo}
              placeholder="Pancard Number"
              minLength="10"
              maxLength="10"
            />
            <ImageViewField image={formData?.panCardImg} title={"Pan Card"} />
            <InputField
              disabled
              label="Primary Contact Number*"
              name="primaryContact"
              value={formData.primaryContact}
              placeholder="Primary Contact Number"
              minLength="10"
              maxLength="10"
            />
            <InputField
              disabled
              label="Secondary Contact Number*"
              name="secondaryContact"
              value={formData.secondaryContact}
              placeholder="Secondary Contact Number"
              minLength="10"
              maxLength="10"
            />
            <InputField
              disabled
              label="Email*"
              name="email"
              value={formData.email}
              placeholder="Enter Email"
            />
            <InputField
              disabled
              label="Designation of Vendor*"
              name="designation"
              value={formData.designation}
            />
            <InputField label="Country *" name="country" value={formData.country} />
            <InputField label="State *" name="state" value={formData.state} />
            <InputField label="City *" name="city" value={formData.city} />
            <InputField label="Pincode *" name="pincode" value={formData.pincode} maxLength={6} minLength={6} />
          </Section>

          {/* company/shop details section */}
          <Section title="Company / Shop Details">
            <InputField
              disabled
              label="Company/Shop Name*"
              name="companyName"
              value={formData.companyName}
              placeholder="Enter Company/Shop Name"
            />
            <InputField
              disabled
              label="Business Type*"
              name="businessType"
              value={formData.businessType}
            />
            <InputField
              disabled
              label="Business Contact Mobile*"
              name="businessMobile"
              value={formData.businessMobile}
              placeholder="Enter Business Mobile"
              minLength="10"
              maxLength="10"
            />
            <InputField
              disabled
              label="Business Contact Email*"
              name="businessEmail"
              value={formData.businessEmail}
              placeholder="Enter Email"
            />
            <InputField
              disabled
              label="Business Pancard Number*"
              name="businessPancardNo"
              value={formData.businessPancardNo}
              placeholder="Pancard Number"
            />
            <ImageViewField image={formData?.businessPanCardImg} title={"Business Pan Card"} />
            <InputField
              disabled
              label="GSTIN*"
              name="gstin"
              value={formData.gstin}
              placeholder="Enter GSTIN"
            />
            <ImageViewField image={formData?.gstCertificateImg} title={"GST Certificate"} />
            <ImageViewField image={formData?.businessAddressImg} title={"Business Address Proof"} />
            <InputField
              label="Business Registered Address *"
              name="businessRegisterAddress"
              value={formData.businessRegisterAddress}
            />
            <InputField label="Address Proof *" name="addressProof" value={formData.addressProof} type="file" />
            <InputField disabled label="Country *" name="country" value={formData.country} />
            <InputField disabled label="State*" name="state" value={formData.state} />
            <InputField disabled label="City*" name="city" value={formData.city} placeholder="Enter City" />
            <InputField
              disabled
              label="Pincode/Zipcode*"
              name="pincode"
              value={formData.pincode}
              placeholder="Enter Pincode"
              maxLength={6}
              minLength={6}
            />
            <div className="">
              <label htmlFor="address" className="block text-sm font-normal text-gray-700">
                Enter Address
              </label>
              <textarea
                name="address"
                className="w-full p-3 border text-xs border-gray-300 rounded-md outline-none mt-1"
                placeholder="Enter Your Full Address"
                value={formData.address}
                disabled
              ></textarea>
            </div>
          </Section>

          {/* bank details section */}
          <Section title="Bank Details">
            <InputField
              disabled
              label="Holder Name*"
              name="holdername"
              value={formData.holdername}
              placeholder="Enter Holder Name"
            />
            <InputField disabled label="Select Bank*" name="bankname" value={formData.bankname} />
            <InputField
              disabled
              label="Bank A/c No*"
              name="accountNumber"
              value={formData.accountNumber}
              placeholder="Enter Bank A/c No"
            />
            <InputField
              disabled
              label="Branch Name*"
              name="branchName"
              value={formData.branchName}
              placeholder="Enter Branch Name"
            />
            <InputField
              disabled
              label="IFSC Code*"
              name="ifsccode"
              value={formData.ifsccode}
              placeholder="IFSC Number"
            />
            <ImageViewField image={formData?.passbook} title={"Passbook"} />
          </Section>
        </div>

        {/* ✅ Conditionally render buttons only if status is pending */}
        {formData.kycStatus === "pending" && (
          <div className="flex items-center gap-3 justify-center">
            <Button
              title={"Approve Vendor"}
              bgcolor={"bg-[#32C98D]"}
              onClick={() => StatusHandler("approved")}
            />
            <Button
              title={"Reject Vendor"}
              bgcolor={"bg-[#DF7272]"}
              onClick={() => StatusHandler("rejected")}
            />
            <Button
              title={"Hold Vendor"}
              bgcolor={"bg-[#EEA81F]"}
              onClick={() => StatusHandler("pending")}
            />
          </div>
        )}

        <Footer1 />
      </div>
    </>
  );
};

export default VendorManagementForm;
