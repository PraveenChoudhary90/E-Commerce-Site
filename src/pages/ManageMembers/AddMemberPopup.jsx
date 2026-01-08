import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import ToggleButton from "../../components/ToggleButton";
import Button from "../../components/Button";
import { CreateMember, updateMember, deleteMember } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import Swal from "sweetalert2";
import { FaPen, FaTrash } from "react-icons/fa6";

const AddMemberPopup = ({ onClose, onSuccess, editMode = false, data = {} }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    aadhaarNumber: "",
    panNumber: "",
    aadhaarPic: null,
    userPic: null,
    panPic: null,
    emailOnFollow: false,
    emailOnPostAnswer: false,
    emailOnMention: false,
    notifyNewLaunches: false,
    notifyProductUpdates: false,
    subscribeToNewLetter: false,
  });

  // Map backend data to frontend payload
  useEffect(() => {
    if (editMode && data) {
      setPayload({
        name: data.name || "",
        email: data.email || "",
        password: "",
        mobile: data.mobile || "",
        aadhaarNumber: data.aadhaarNumber || "",
        panNumber: data.panNumber || "",
        aadhaarPic: null, // always upload new file if user chooses
        userPic: null,
        panPic: null,
        emailOnFollow: data.permissions?.emailOnFollow || false,
        emailOnPostAnswer: data.permissions?.emailOnPostAnswer || false,
        emailOnMention: data.permissions?.emailOnMention || false,
        notifyNewLaunches: data.permissions?.notifyNewLaunches || false,
        notifyProductUpdates: data.permissions?.notifyProductUpdates || false,
        subscribeToNewLetter: data.permissions?.subscribeToNewLetter || false,
      });
    }
  }, [editMode, data]);

  // Generic input handler
  const handleChange = (key, value) => setPayload(prev => ({ ...prev, [key]: value }));

  const validateFields = () => {
    let tempErrors = {};
    if (!payload.name) tempErrors.name = "Name is required!";
    if (!payload.email) tempErrors.email = "Email is required!";
    if (!editMode && !payload.password) tempErrors.password = "Password is required!";
    if (!payload.mobile) tempErrors.mobile = "Mobile number is required!";
    if (!payload.aadhaarNumber) tempErrors.aadhaarNumber = "Aadhaar number is required!";
    if (!payload.panNumber) tempErrors.panNumber = "PAN number is required!";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(payload.panNumber)) tempErrors.panNumber = "Enter valid PAN number! (ABCDE1234F)";
    
    if (!editMode) {
      if (!payload.aadhaarPic) tempErrors.aadhaarPic = "Aadhaar photo required!";
      if (!payload.userPic) tempErrors.userPic = "User photo required!";
      if (!payload.panPic) tempErrors.panPic = "PAN photo required!";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle delete
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This member will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await deleteMember(data._id);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
      if (onSuccess) onSuccess(data._id); // parent removes member
      onClose();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error?.response?.data?.message || "Delete failed!" });
    } finally {
      setLoading(false);
    }
  };

  // Handle add/update
  const handleAdd = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      for (const key in payload) if (payload[key] !== null) formData.append(key, payload[key]);

      if (editMode) {
        const response = await updateMember(data._id, formData);
        Swal.fire({ icon: "success", title: "Member Updated!", timer: 1200, showConfirmButton: false });

        // Map backend image fields to frontend
        const updatedMember = {
          ...response.member,
          userPic: response.member.userPicUrl,
          aadhaarPic: response.member.aadhaarPicUrl,
          panPic: response.member.panPicUrl,
        };

        if (onSuccess) onSuccess(updatedMember);
      } else {
        const response = await CreateMember(formData);
        Swal.fire({ icon: "success", title: "Member Added!", timer: 1200, showConfirmButton: false });

        // Map backend fields
        const newMember = {
          ...response.member,
          userPic: response.member.userPicUrl,
          aadhaarPic: response.member.aadhaarPicUrl,
          panPic: response.member.panPicUrl,
        };

        if (onSuccess) onSuccess(newMember); // immediately add to parent list
      }

      onClose();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error?.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // Permission toggle helper
  const renderToggle = (key, label) => (
    <div className="flex gap-2 items-center" key={key}>
      <ToggleButton isEnabled={payload[key]} onToggle={(v) => handleChange(key, v)} />
      <p>{label}</p>
    </div>
  );

  return (
    <>
      {loading && <PageLoader />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start md:items-center overflow-auto z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-5xl p-5 space-y-5 relative flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{editMode ? "Edit Member" : "Add Member"}</h2>
            <div className="flex items-center gap-4">
              {editMode && <FaTrash className="text-red-500 text-xl cursor-pointer hover:text-red-700" onClick={handleDelete} />}
              <button onClick={onClose} className="text-3xl">&times;</button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[70vh] space-y-5">
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["name", "email", "password", "mobile", "aadhaarNumber", "panNumber"].map((field) => (
                  <div className="relative" key={field}>
                    <InputField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                      type={field === "password" ? "password" : "text"}
                      value={payload[field]}
                      onChange={(e) => handleChange(field, field === "panNumber" ? e.target.value.toUpperCase() : e.target.value)}
                    />
                    {["name", "panNumber"].includes(field) && <FaPen className="absolute right-3 top-10 text-gray-400" />}
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}

                {["aadhaarPic", "panPic", "userPic"].map((fileField) => (
                  <div key={fileField}>
                    <label>{fileField.replace("Pic", " Photo")}</label>
                    <input type="file" accept="image/*" onChange={(e) => handleChange(fileField, e.target.files[0])} />
                    {errors[fileField] && <p className="text-red-500">{errors[fileField]}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h1 className="text-center text-sm md:text-lg font-medium">Assign Permissions</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="text-gray-400 space-y-4">
                    <h1>ACCOUNT</h1>
                    {[
                      ["emailOnFollow", "Email me when someone follows me"],
                      ["emailOnPostAnswer", "Email me when someone answers on my post"],
                      ["emailOnMention", "Email me when someone mentions me"],
                    ].map(([key, label]) => renderToggle(key, label))}
                  </div>
                  <div className="text-gray-400 space-y-4">
                    <h1>NOTIFICATIONS</h1>
                    {[
                      ["notifyNewLaunches", "New launches & projects"],
                      ["notifyProductUpdates", "Monthly product updates"],
                      ["subscribeToNewLetter", "Subscribe to newsletter"],
                    ].map(([key, label]) => renderToggle(key, label))}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="sticky bottom-0 bg-white py-3 text-center border-t mt-2">
            <Button title={editMode ? "Update" : "Create Member"} onClick={handleAdd} className="w-full md:w-1/3 m-auto py-3" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMemberPopup;
