import { useEffect, useState } from "react";
import MemberBannerPart from "./MemberBannerPart";
import Button from "../../components/Button";
import ToggleButton from "../../components/ToggleButton";
import { getMemberById } from "../../api/auth-api";
import { useParams } from "react-router-dom";
import AddMemberPopup from "./AddMemberPopup";
import Footer1 from "../../components/Footer1";

const MemberProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getMemberById(id).then((res) => setData(res.member));
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="flex flex-col gap-5">
      {showPopup && (
        <AddMemberPopup onClose={togglePopup} editMode={true} data={data} />
      )}
      <div className="flex flex-col gap-6">
        <MemberBannerPart onClick={togglePopup}
          heading={"Member Profile"}
          btnTitle={"Overview"}
          name={data.name}
          role={data.role}
          email={data.email}
        />
        <div className="bg-white p-4 mt-16 rounded-xl space-y-5">
          <div className="flex gap-3 items-center justify-between">
            <h1 className="font-medium lg:text-xl md:text-lg text-base ">
              Platform Settings
            </h1>
            <Button title={"Edit"} onClick={togglePopup} />
          </div>
          <div className="">
            <div className="grid xl:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-3 grid-cols-1">
              <div className="text-gray-400 space-y-4">
                <h1 className="">ACCOUNT</h1>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <ToggleButton isEnabled={data?.toggles?.emailOnFollow} />
                    <p className="text-xs">Email me when someone follows me</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ToggleButton
                      isEnabled={data?.toggles?.emailOnPostAnswer}
                    />
                    <p className="text-xs">
                      Email me when someone answers on my post
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ToggleButton isEnabled={data?.toggles?.emailOnMention} />
                    <p className="text-xs">Email me when someone mentions me</p>
                  </div>
                </div>
              </div>
              <div className="text-gray-400 space-y-4">
                <h1 className="">ACCOUNT</h1>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <ToggleButton
                      isEnabled={data?.toggles?.notifyNewLaunches}
                    />
                    <p className="text-xs">New launches and projects</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ToggleButton
                      isEnabled={data?.toggles?.notifyProductUpdates}
                    />
                    <p className="text-xs">Monthly product updates</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ToggleButton
                      isEnabled={data?.toggles?.subscribeToNewsletter}
                    />
                    <p className="text-xs">Subscribe to newsletter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl space-y-5">
          <div className="flex gap-3 items-center justify-between">
            <h1 className="font-medium lg:text-xl md:text-lg text-base ">
              Profile Information
            </h1>
            {/* <Button title={"Edit"} /> */}
          </div>
          {/* <p className='py-2 border-b text-xs text-gray-400'>Hi, I’m {data.name}, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).</p> */}
          <div className="flex items-center justify-center gap-5 text-sm flex-wrap">
            <div className="flex gap-2 items-center text-gray-500">
              <b>Full Name: </b>
              <p>{data.name}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Role: </b>
              <p>{data.role}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Active User: </b>
              <p>{data.status ? "Yes" : "No"}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Mobile: </b>
              <p>{data.mobile}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Email: </b>
              <p>{data.email}</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Location: </b>
              <p> India</p>
            </div>
            <div className="flex gap-2 items-center text-gray-500">
              <b>Joining Date: </b>
              <p>{data.joiningDate}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default MemberProfile;
