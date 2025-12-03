import { useEffect, useState } from "react";
import MemberBannerPart from "./MemberBannerPart";
import Button from "../../components/Button";
import ToggleButton from "../../components/ToggleButton";
import { getMemberById } from "../../api/auth-api";
import { useParams } from "react-router-dom";
import AddMemberPopup from "./AddMemberPopup";
import Footer1 from "../../components/Footer1";
import { FaPen } from "react-icons/fa6";

// Placeholder images
const DEFAULT_USER_IMG = "https://via.placeholder.com/150?text=User";
const DEFAULT_AADHAAR_IMG = "https://via.placeholder.com/150?text=Aadhaar";
const DEFAULT_PAN_IMG = "https://via.placeholder.com/150?text=PAN";

const MemberProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null); // Initial null for safe checks
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemberById(id)
      .then((res) => setData(res.User))
      .catch((err) => console.error("Error fetching member:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const togglePopup = () => setShowPopup(!showPopup);

  if (loading) return <p className="text-center mt-10">Loading member data...</p>;
  if (!data) return <p className="text-center mt-10">Member not found!</p>;

  return (
    <div className="flex flex-col gap-5">
      {showPopup && (
        <AddMemberPopup onClose={togglePopup} editMode={true} data={data} />
      )}

      <div className="flex flex-col gap-6">
        <MemberBannerPart
          onClick={togglePopup}
          heading={"Member Profile"}
          btnTitle={"Overview"}
          name={data?.name}
          email={data?.email}
        />

        {/* Images Section */}
        <div className="bg-white p-4 mt-16 rounded-xl space-y-5">
          <div className="flex gap-3 items-center justify-between">
            <h1 className="font-medium lg:text-xl md:text-lg text-base">
              Profile Information
            </h1>
            <Button title={"Edit"} onClick={togglePopup} />
          </div>

          <div className="flex justify-center gap-8 mb-4">
            {/* User Image */}
            <div className="flex flex-col items-center relative">
              <img
                src={data?.userPicUrl || DEFAULT_USER_IMG}
                alt="User"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <FaPen
                className="absolute top-0 right-0 text-gray-600 cursor-pointer"
                onClick={togglePopup}
              />
              <span className="mt-2 text-sm text-gray-600">User Image</span>
            </div>

            {/* Aadhaar Image */}
            <div className="flex flex-col items-center relative">
              <img
                src={data?.aadhaarPicUrl || DEFAULT_AADHAAR_IMG}
                alt="Aadhaar"
                className="w-32 h-32 rounded-xl object-cover border"
              />
              <FaPen
                className="absolute top-0 right-0 text-gray-600 cursor-pointer"
                onClick={togglePopup}
              />
              <span className="mt-2 text-sm text-gray-600">Aadhaar Image</span>
            </div>

            {/* PAN Image */}
            <div className="flex flex-col items-center relative">
              <img
                src={data?.panPicUrl || DEFAULT_PAN_IMG}
                alt="PAN"
                className="w-32 h-32 rounded-xl object-cover border"
              />
              <FaPen
                className="absolute top-0 right-0 text-gray-600 cursor-pointer"
                onClick={togglePopup}
              />
              <span className="mt-2 text-sm text-gray-600">PAN Image</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
            <div className="flex gap-2 items-center text-gray-500 relative">
              <b>Full Name: </b>
              <p>{data?.name}</p>
              <FaPen
                className="ml-1 text-gray-400 cursor-pointer"
                onClick={togglePopup}
              />
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Active User: </b>
              <p>{data?.status === "approved" ? "Yes" : "No"}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Mobile: </b>
              <p>{data?.mobile}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Email: </b>
              <p>{data?.email}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Status: </b>
              <p>{data?.status}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>PAN Number: </b>
              <p>{data?.panNumber || "N/A"}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Location: </b>
              <p>India</p>
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white p-4 rounded-xl space-y-5">
          <div className="flex gap-3 items-center justify-between">
            <h1 className="font-medium lg:text-xl md:text-lg text-base">
              Platform Settings
            </h1>
            <Button title={"Edit"} onClick={togglePopup} />
          </div>
          <div className="grid xl:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-3 grid-cols-1">
            <div className="text-gray-400 space-y-4">
              <h1>ACCOUNT</h1>
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <ToggleButton isEnabled={data?.toggles?.emailOnFollow} />
                  <p className="text-xs">Email me when someone follows me</p>
                </div>
                <div className="flex gap-2 items-center">
                  <ToggleButton isEnabled={data?.toggles?.emailOnPostAnswer} />
                  <p className="text-xs">Email me when someone answers on my post</p>
                </div>
                <div className="flex gap-2 items-center">
                  <ToggleButton isEnabled={data?.toggles?.emailOnMention} />
                  <p className="text-xs">Email me when someone mentions me</p>
                </div>
              </div>
            </div>
            <div className="text-gray-400 space-y-4">
              <h1>NOTIFICATIONS</h1>
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <ToggleButton isEnabled={data?.toggles?.notifyNewLaunches} />
                  <p className="text-xs">New launches and projects</p>
                </div>
                <div className="flex gap-2 items-center">
                  <ToggleButton isEnabled={data?.toggles?.notifyProductUpdates} />
                  <p className="text-xs">Monthly product updates</p>
                </div>
                <div className="flex gap-2 items-center">
                  <ToggleButton isEnabled={data?.toggles?.subscribeToNewsletter} />
                  <p className="text-xs">Subscribe to newsletter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default MemberProfile;
