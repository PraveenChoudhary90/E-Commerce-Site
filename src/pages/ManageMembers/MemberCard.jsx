import React from "react";
import defaultProfile from "../../assets/manageMembers/defaultProfile.png";
import { useNavigate } from "react-router-dom";

const MemberCard = (data) => {
  const {email,mobile,name,role,status,toggles,_id} = data;
const navigate = useNavigate()
  return (
    <div className="rounded-xl bg-white min-h-80 flex flex-col justify-between">
      <div className="p-3">
        <img src={defaultProfile}  alt="" className="rounded-xl h-auto w-full" />
      </div>
      <div className="px-4 pb-4 flex flex-col gap-3 items-start">
        <p className="text-[#A0AEC0] text-sm font-medium uppercase">{role}</p>
        <h1 className="text-[#2D3748]">{name}</h1>
        {/* <p className="text-sm text-[#A0AEC0] font-light">
          As Uber works through a huge amount of internal management turmoil.
        </p> */}
        <button className="text-bg-color border border-bg-color text-sm rounded-lg px-4 py-1" onClick={()=>navigate(`/memberprofile/${_id}`)}>VIEW PROFILE</button>
      </div>
    </div>
  );
};

export default MemberCard;
