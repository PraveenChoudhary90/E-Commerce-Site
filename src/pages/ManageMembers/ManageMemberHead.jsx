import React, { useEffect, useState } from "react";
import MemberCard from "./MemberCard";
import { IoMdAdd } from "react-icons/io";
import AddMemberPopup from "./AddMemberPopup";
import MemberBannerPart from "./MemberBannerPart";
import { getMembers } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader"; // Import PageLoader

const ManageMemberHead = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [memberData, setMemberData] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        getMembers()
            .then((res) => setMemberData(res.members))
            .catch((err) => console.error("Error fetching members:", err))
            .finally(() => setLoading(false)); // Hide loader when data is fetched
    }, []);

    return (
        <div className="flex flex-col gap-5">
            {loading && <PageLoader />} {/* Show loader while fetching data */}
            
            {!loading && (
                <>
                    <MemberBannerPart heading="Manage Members" btnTitle="Add Member" onClose={togglePopup} />
                    <h1 className="font-medium lg:text-xl md:text-lg text-base mt-10">Members Profile</h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4 gap-5">
                        <div
                            onClick={togglePopup}
                            className="border-bg-color border min-h-80 sm:h-full flex flex-col justify-center items-center rounded-xl space-y-2 cursor-pointer"
                        >
                            <IoMdAdd color="702F8A" size={24} />
                            <h1 className="text-bg-color font-medium">Create a New Member</h1>
                        </div>

                        {memberData?.map((el) => (
                            <MemberCard key={el.id} {...el} />
                        ))}
                    </div>

                    {showPopup && <AddMemberPopup onClose={togglePopup} />}
                </>
            )}
        </div>
    );
};

export default ManageMemberHead;
