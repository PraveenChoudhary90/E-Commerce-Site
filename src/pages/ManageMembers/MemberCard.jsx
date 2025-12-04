import React from "react";
import defaultProfile from "../../assets/manageMembers/defaultProfile.png";
import { useNavigate } from "react-router-dom";

const MemberCard = (props) => {
  const { email, mobile, name, role, status, toggles, _id, onEdit } = props;
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white min-h-80 flex flex-col justify-between">
      <div className="p-3">
        <img
          src={defaultProfile}
          alt=""
          className="rounded-xl h-auto w-full"
        />
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3 items-start">
        <p className="text-[#A0AEC0] text-sm font-medium uppercase">{role}</p>
        <h1 className="text-[#2D3748]">{name}</h1>

        <div className="flex gap-3">
          <button
            className="text-bg-color border border-bg-color text-sm rounded-lg px-4 py-1"
            onClick={() => navigate(`/memberprofile/${_id}`)}
          >
            VIEW PROFILE
          </button>

          <button
            className="text-red-600 border border-red-600 text-sm rounded-lg px-4 py-1"
            onClick={onEdit}        
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
