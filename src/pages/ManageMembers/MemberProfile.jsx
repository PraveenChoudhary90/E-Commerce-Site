import { useEffect, useState } from "react";
import MemberBannerPart from "./MemberBannerPart";
import Button from "../../components/Button";
import ToggleButton from "../../components/ToggleButton";
import { getMemberById } from "../../api/auth-api";
import { useParams } from "react-router-dom";
import AddMemberPopup from "./AddMemberPopup";
import Footer1 from "../../components/Footer1";

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
          heading={"MR Member Profile"}
          btnTitle={"Overview"}
          name={data?.name}
          email={data?.email}
        />

        {/* Images Section */}
        <div className="bg-white p-4 mt-16 rounded-xl space-y-5">
          <h1 className="font-medium lg:text-xl md:text-lg text-base mb-4">
            Profile Images
          </h1>
          <div className="flex justify-center gap-8 mb-4">
            {/* User Image */}
            <div className="flex flex-col items-center">
              <img
                src={data?.userPicUrl || DEFAULT_USER_IMG}
                alt="User"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <span className="mt-2 text-sm text-gray-600">MR Image</span>
            </div>

            {/* Aadhaar Image */}
            <div className="flex flex-col items-center">
              <img
                src={data?.aadhaarPicUrl || DEFAULT_AADHAAR_IMG}
                alt="Aadhaar"
                className="w-32 h-32 rounded-xl object-cover border"
              />
              <span className="mt-2 text-sm text-gray-600">Aadhaar Image</span>
            </div>

            {/* PAN Image */}
            <div className="flex flex-col items-center">
              <img
                src={data?.panPicUrl || DEFAULT_PAN_IMG}
                alt="PAN"
                className="w-32 h-32 rounded-xl object-cover border"
              />
              <span className="mt-2 text-sm text-gray-600">PAN Image</span>
            </div>
          </div>
        </div>

        {/* Profile Details as Table */}
        <div className="overflow-x-auto bg-white p-4 mt-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-medium lg:text-xl md:text-lg text-base">
              Profile Information
            </h1>
            <Button title={"Edit"} onClick={togglePopup} className="text-white" />
          </div>

          <table className="w-full border-collapse text-gray-700">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold w-1/3">Full Name</td>
                <td className="py-2">{data?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Active MR Member</td>
                <td className="py-2">{data?.status === "approved" ? "Yes" : "No"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Mobile</td>
                <td className="py-2">{data?.mobile}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Email</td>
                <td className="py-2">{data?.email}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Status</td>
                <td className="py-2">{data?.status}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">PAN Number</td>
                <td className="py-2">{data?.panNumber || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Location</td>
                <td className="py-2">India</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Platform Settings */}
        <div className="bg-white p-4 rounded-xl space-y-5 mt-4">
          <div className="flex gap-3 items-center justify-between">
            <h1 className="font-medium lg:text-xl md:text-lg text-base">
              Platform Settings
            </h1>
            <Button title={"Edit"} onClick={togglePopup} className="text-white" />
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
