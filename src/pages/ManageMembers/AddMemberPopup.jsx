import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import ToggleButton from "../../components/ToggleButton";
import Button from "../../components/Button";
import { CreateMember, updateMember } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import Swal from "sweetalert2";
import { FaPen } from "react-icons/fa6";

const AddMemberPopup = ({ onClose, onSuccess, editMode = false, data = {} }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    name: "",
    email: "",
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

  useEffect(() => {
    if (editMode && data) {
      setPayload({
        name: data.name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        aadhaarNumber: data.aadhaarNumber || "",
        panNumber: data.panNumber || "",
        aadhaarPic: null,
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

  const validateFields = () => {
    let tempErrors = {};

    if (!payload.name) tempErrors.name = "Name is required!";
    if (!payload.email) tempErrors.email = "Email is required!";
    if (!payload.mobile) tempErrors.mobile = "Mobile number is required!";
    if (!payload.aadhaarNumber) tempErrors.aadhaarNumber = "Aadhaar number is required!";
    if (!payload.panNumber) tempErrors.panNumber = "PAN number is required!";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(payload.panNumber))
      tempErrors.panNumber = "Enter valid PAN number! (ABCDE1234F)";

    if (!editMode) {
      if (!payload.aadhaarPic) tempErrors.aadhaarPic = "Aadhaar photo required!";
      if (!payload.userPic) tempErrors.userPic = "User photo required!";
      if (!payload.panPic) tempErrors.panPic = "PAN photo required!";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in payload) {
        if (payload[key] !== null) {
          formData.append(key, payload[key]);
        }
      }

      if (editMode) {
        // Update existing member
        const updatedMember = await updateMember(data._id, formData);
        Swal.fire({
          icon: "success",
          title: "Member Updated!",
          text: "Member details updated successfully",
          timer: 1200,
          showConfirmButton: false,
        });
        if (onSuccess) onSuccess(updatedMember);
      } else {
        // Add new member
        const response = await CreateMember(formData);
        // Merge returned _id with local payload for instant display
        const newMember = { _id: response._id, ...payload };
        Swal.fire({
          icon: "success",
          title: "Member Added!",
          text: "Member inserted successfully",
          timer: 1200,
          showConfirmButton: false,
        });
        if (onSuccess) onSuccess(newMember);
      }

      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl w-11/12 max-w-5xl p-5 space-y-3 relative">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editMode ? "Edit Member" : "Add Member"}
            </h2>
            <button onClick={onClose} className="text-3xl">&times;</button>
          </div>

          <form className="space-y-5">
            <div className="bg-bg-color1 p-6 rounded-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="relative">
                  <InputField
                    label="Name"
                    placeholder="Enter Name"
                    value={payload.name}
                    onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                  />
                  <FaPen className="absolute right-3 top-10 text-gray-400" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <InputField
                  label="Email"
                  placeholder="Enter Email"
                  value={payload.email}
                  onChange={(e) => setPayload({ ...payload, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}

                <InputField
                  label="Mobile"
                  placeholder="Enter Mobile Number"
                  value={payload.mobile}
                  onChange={(e) => setPayload({ ...payload, mobile: e.target.value })}
                />
                {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}

                <InputField
                  label="Aadhaar Number"
                  placeholder="Enter Aadhaar Number"
                  value={payload.aadhaarNumber}
                  onChange={(e) => setPayload({ ...payload, aadhaarNumber: e.target.value })}
                />
                {errors.aadhaarNumber && <p className="text-red-500">{errors.aadhaarNumber}</p>}

                <div className="relative">
                  <InputField
                    label="PAN Number"
                    placeholder="Enter PAN Number"
                    value={payload.panNumber}
                    onChange={(e) =>
                      setPayload({ ...payload, panNumber: e.target.value.toUpperCase() })
                    }
                  />
                  <FaPen className="absolute right-3 top-10 text-gray-400" />
                  {errors.panNumber && <p className="text-red-500">{errors.panNumber}</p>}
                </div>

                <div>
                  <label>Aadhaar Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPayload({ ...payload, aadhaarPic: e.target.files[0] })}
                  />
                  {errors.aadhaarPic && <p className="text-red-500">{errors.aadhaarPic}</p>}
                </div>

                <div>
                  <label>PAN Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPayload({ ...payload, panPic: e.target.files[0] })}
                  />
                  {errors.panPic && <p className="text-red-500">{errors.panPic}</p>}
                </div>

                <div>
                  <label>User Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPayload({ ...payload, userPic: e.target.files[0] })}
                  />
                  {errors.userPic && <p className="text-red-500">{errors.userPic}</p>}
                </div>

              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-center text-sm md:text-lg font-medium">Assign Permissions</h1>

              <div className="grid lg:grid-cols-2 gap-5 grid-cols-1">
                <div className="text-gray-400 space-y-4">
                  <h1>ACCOUNT</h1>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.emailOnFollow}
                        onToggle={(v) => setPayload({ ...payload, emailOnFollow: v })}
                      />
                      <p>Email me when someone follows me</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.emailOnPostAnswer}
                        onToggle={(v) => setPayload({ ...payload, emailOnPostAnswer: v })}
                      />
                      <p>Email me when someone answers on my post</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.emailOnMention}
                        onToggle={(v) => setPayload({ ...payload, emailOnMention: v })}
                      />
                      <p>Email me when someone mentions me</p>
                    </div>
                  </div>
                </div>

                <div className="text-gray-400 space-y-4">
                  <h1>NOTIFICATIONS</h1>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.notifyNewLaunches}
                        onToggle={(v) => setPayload({ ...payload, notifyNewLaunches: v })}
                      />
                      <p>New launches & projects</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.notifyProductUpdates}
                        onToggle={(v) => setPayload({ ...payload, notifyProductUpdates: v })}
                      />
                      <p>Monthly product updates</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.subscribeToNewLetter}
                        onToggle={(v) => setPayload({ ...payload, subscribeToNewLetter: v })}
                      />
                      <p>Subscribe to newsletter</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                title={editMode ? "Update" : "Create Member"}
                onClick={handleAdd}
                className="w-fit m-auto py-3"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMemberPopup;
