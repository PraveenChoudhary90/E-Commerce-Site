import React from "react";
import backgroundImage from "../../assets/manageMembers/Background.png";
import defaultProfile from "../../assets/manageMembers/defaultProfile.png";
import Button from "../../components/Button";
import { FaPencil } from "react-icons/fa6";
const MemberBannerPart = ({ heading, onClose, btnTitle, name, email, role ,onClick }) => {
  return (
    <div>
      <div className="relative">
        <h1 className="font-medium absolute top-5 left-5 lg:text-xl md:text-lg text-base text-white">{heading}</h1>
        <img src={backgroundImage} alt="" className="h-[100px] object-cover rounded-xl w-full" />
        <div className="absolute w-[95%] ml-[2.5%] shadow-md flex items-center justify-between px-4 h-20 rounded-md bg-[#ffffff98] backdrop-blur-lg -bottom-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-md bg-red-200 relative">
              <img src={defaultProfile} alt="" className="h-full object-cover rounded-md  w-full" />
              {name && role && (<div className="absolute -bottom-1 -right-1 ">
                <div onClick={onClick} className="w-5 h-5 text-bg-color text-xs flex items-center justify-center cursor-pointer bg-white rounded">
                  <FaPencil />
                </div>
              </div>)}
            </div>
            {name && role && (<div className="flex flex-col">
              <h1 className="font-medium">
                {name} ({role})
              </h1>
              <p className="text-gray-500 text-xs">{email}</p>
            </div>)}
          </div>
          <div>
            {/* <Button title={btnTitle} onClick={onClose} className="cursor-none"/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberBannerPart;
