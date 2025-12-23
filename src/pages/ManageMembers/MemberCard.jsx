import React from "react";
import defaultProfile from "../../assets/manageMembers/defaultProfile.png";
import { useNavigate } from "react-router-dom";

const MemberCard = (props) => {
  // Destructure the props
  const { name, role, _id, onEdit, userPicUrl } = props;
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white min-h-80 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
       {/* User Image */}
      <div className="flex justify-center mt-4">
        <div className="w-40 h-40 overflow-hidden border-2 border-gray-200">
          <img
            src={userPicUrl || defaultProfile}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Member Info */}
      <div className="px-4 pb-4 flex flex-col gap-3 items-center text-center">
        <p className="text-gray-400 text-sm font-medium uppercase">{role}</p>
        <h1 className="text-gray-800 font-semibold">{name}</h1>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            className="text-bg-color border border-bg-color text-sm rounded-lg px-4 py-1 hover:bg-bg-color hover:text-white transition-colors"
            onClick={() => navigate(`/memberprofile/${_id}`)}
          >
            VIEW PROFILE
          </button>

          <button
            className="text-red-600 border border-red-600 text-sm rounded-lg px-4 py-1 hover:bg-red-600 hover:text-white transition-colors"
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
