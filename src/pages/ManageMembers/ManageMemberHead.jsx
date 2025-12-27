import React, { useEffect, useState } from "react";
import MemberCard from "./MemberCard";
import { IoMdAdd } from "react-icons/io";
import AddMemberPopup from "./AddMemberPopup";
import MemberBannerPart from "./MemberBannerPart";
import { getMembers } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";

const ManageMemberHead = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) setEditData(null);
  };

  useEffect(() => {
    getMembers()
      .then((res) => setMemberData(res))
      .catch((err) => console.error("Error fetching members:", err))
      .finally(() => setLoading(false));
  }, []);

  // ADD / UPDATE
  const handleAddOrUpdateMember = (member) => {
    if (editData) {
      setMemberData((prev) =>
        prev.map((m) => (m._id === member._id ? member : m))
      );
    } else {
      setMemberData((prev) => [member, ...prev]);
    }
    setShowPopup(false);
    setEditData(null);
  };

  // ⭐ DELETE HANDLER
  const handleDeleteMember = (id) => {
    setMemberData((prev) => prev.filter((m) => m._id !== id));
    setShowPopup(false);
    setEditData(null);
  };

  const handleEdit = (member) => {
    setEditData(member);
    setShowPopup(true);
  };

  return (
    <div className="flex flex-col gap-5">
      {loading && <PageLoader />}

      {!loading && (
        <>
          <MemberBannerPart
            heading="MR Manage Members"
            btnTitle="Add Member"
            onClose={togglePopup}
          />

          <h1 className="font-medium lg:text-xl md:text-lg text-base mt-10">
           MR Members Profile
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4 gap-5">
            <div
              onClick={togglePopup}
              className="border-bg-color border min-h-80 sm:h-full flex flex-col justify-center items-center rounded-xl space-y-2 cursor-pointer"
            >
              <IoMdAdd color="#702F8A" size={24} />
              <h1 className="text-bg-color font-medium">Create a New MR Member</h1>
            </div>

            {memberData?.map((el) => (
              <MemberCard key={el._id} {...el} onEdit={() => handleEdit(el)} />
            ))}
          </div>

          {showPopup && (
            <AddMemberPopup
              onClose={togglePopup}
              onSuccess={editData ? handleDeleteMember : handleAddOrUpdateMember}
              editMode={!!editData}
              data={editData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageMemberHead;
