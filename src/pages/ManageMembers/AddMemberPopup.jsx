import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import SelectComponent from "../../components/SelectComponent";
import ToggleButton from "../../components/ToggleButton";
import Button from "../../components/Button";
import { CreateMember, updateMember } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import Swal from "sweetalert2";

const AddMemberPopup = ({ onClose, editMode = false, data = {} }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
    joiningDate: "",
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
        password: "",
        role: data.role || "",
        joiningDate: data.joiningDate ? data.joiningDate.split("T")[0] : "",
        emailOnFollow: data.toggles.emailOnFollow || false,
        emailOnPostAnswer: data.toggles.emailOnPostAnswer || false,
        emailOnMention: data.toggles.emailOnMention || false,
        notifyNewLaunches: data.toggles.notifyNewLaunches || false,
        notifyProductUpdates: data.toggles.notifyProductUpdates || false,
        subscribeToNewLetter: data.toggles.subscribeToNewsletter || false,
      });
    }
  }, [editMode, data]);

  const validateFields = () => {
    let tempErrors = {};
    if (!payload.name) tempErrors.name = "Member name is required!";
    if (!payload.email) {
        tempErrors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        tempErrors.email = "Enter a valid email!";
    }

    if (!payload.mobile) {
        tempErrors.mobile = "Mobile number is required!";
    } else if (!/^\d{10}$/.test(payload.mobile)) {
        tempErrors.mobile = "Enter a valid 10-digit mobile number!";
    }
    if (!editMode && !payload.password) tempErrors.password = "Password is required!";
    if (!payload.role) tempErrors.role = "Member role is required!";
    if (!payload.joiningDate) tempErrors.joiningDate = "Joining Date is required!";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);

      if (editMode) {
        await updateMember(data._id, payload);
        Swal.fire({
          icon: "success",
          title: "Member Updated!",
          text: "Member updated successfully",
        }).then(() => window.location.reload());
      } else {
        await CreateMember(payload);
        Swal.fire({
          icon: "success",
          title: "Member Added!",
          text: "Member added successfully",
        }).then(() => window.location.reload());
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key, value) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl w-11/12 max-w-5xl p-5 space-y-3 relative">
          <div className="flex items-center gap-5 justify-between">
            <h2 className="text-xl font-medium mb-4">{editMode ? "Edit Member Profile" : "Add Member"}</h2>
            <button className=" bg-red-500 w-10 h-10 rounded-full flex items-center justify-center" onClick={onClose}>
              <div className="w-7 h-7 border-2 flex items-center justify-center rounded-full text-white text-2xl">
                &times;
              </div>
            </button>
          </div>
          <form action="" className="space-y-5">
            <div className="bg-bg-color1 p-6 rounded-xl">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                <InputField
                  placeholder={"Enter Name"}
                  label={"Name"}
                  type="text"
                  onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                  value={payload.name}
                />
                 {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
               <div>
               <InputField
                  placeholder={"Enter Email"}
                  label={"Email"}
                  type="email"
                  onChange={(e) => setPayload({ ...payload, email: e.target.value })}
                  value={payload.email}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
               </div>
               <div>
               <InputField
                  placeholder={"Enter Number"}
                  label={"Mobile"}
                  type="number"
                  onChange={(e) => setPayload({ ...payload, mobile: e.target.value })}
                  value={payload.mobile}
                />
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
               </div>
<div>
{!editMode && (
                 <>
                 <InputField placeholder="Enter Your Password" label="Generate Password" type="password" onChange={(e) => setPayload({ ...payload, password: e.target.value })} value={payload.password}/>
                 {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
             </>
                )}
</div>
             <div>
             <SelectComponent
                  onChange={(e) => setPayload({ ...payload, role: e.target.value })}
                  value={payload.role}
                  label="Assign Role"
                  options={[
                    { value: "-- Select Role --", label: "-- Select Role --" },
                    { value: "management", label: "Management" },
                  ]}
                />
                 {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
             </div>
          
<div>
<InputField
                  value={payload.joiningDate}
                  placeholder={"Enter Your Joining Date"}
                  label={"Joining Date"}
                  type="date"
                  onChange={(e) => setPayload({ ...payload, joiningDate: e.target.value })}
                />
                 {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
</div>
              
              </div>
            </div>
            <div className="max-w-3xl mx-auto  space-y-4">
              <h1 className="text-center text-sm md:text-lg font-medium">Assign Permissions</h1>
              <div className="grid lg:grid-cols-2 gap-5 grid-cols-1">
                <div className="text-gray-400 space-y-4">
                  <h1 className="">ACCOUNT</h1>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.emailOnFollow}
                        onToggle={(value) => handleToggle("emailOnFollow", value)}
                      />
                      <p className="text-sm">Email me when someone follows me</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.emailOnPostAnswer}
                        onToggle={(value) => handleToggle("emailOnPostAnswer", value)}
                      />
                      <p className="text-sm">Email me when someone answers on my post</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.emailOnMention}
                        onToggle={(value) => handleToggle("emailOnMention", value)}
                      />
                      <p className="text-sm">Email me when someone mentions me</p>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 space-y-4 mb-5">
                  <h1 className="">ACCOUNT</h1>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.notifyNewLaunches}
                        onToggle={(value) => handleToggle("notifyNewLaunches", value)}
                      />
                      <p className="text-sm">New launches and projects</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.notifyProductUpdates}
                        onToggle={(value) => handleToggle("notifyProductUpdates", value)}
                      />
                      <p className="text-sm">Monthly product updates</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        isEnabled={payload.subscribeToNewLetter}
                        onToggle={(value) => handleToggle("subscribeToNewLetter", value)}
                      />
                      <p className="text-sm">Subscribe to newsletter</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button title={editMode ? "Edit" : "Create Members"} onClick={handleAdd} className="w-fit m-auto py-3" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMemberPopup;
