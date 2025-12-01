/* eslint-disable react/prop-types */
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "../../components/Button";
import { formatDateTime } from "../../utils/dateFunctions";
import { useNavigate } from "react-router-dom";
import AddMemberPopup from "../ManageMembers/AddMemberPopup";
import { useState } from "react";
import { deleteMember } from "../../api/auth-api";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import { Routers } from "../../constants/Routes";

const AdminMembers = ({ data, adminListHangler }) => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState({
    show: false,
    data: "",
  });
  const togglePopup = (data) => {
    setShowPopup(() => ({
      show: !showPopup.show,
      data: data,
    }));
  };
  const navigate = useNavigate();
  const navigateViewDetailHandler = (memberId) => {
    navigate(`/memberprofile/${memberId}`);
  };
  const deleteMemberHandler = async (memberId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await deleteMember(memberId);
          Swal.fire("Deleted!", "Member has been deleted.", "success");
          adminListHangler();
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
      }
    });
  };
  return (
    <>
      {showPopup?.show && (
        <AddMemberPopup
          onClose={togglePopup}
          editMode={true}
          data={showPopup.data}
        />
      )}
      {loading && <PageLoader />}

      <div className="bg-white rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-base font-semibold">Management Member</h3>
          <Button title={"View All"} link={Routers.ManageMembers}/>
        </div>
        <div className="overflow-x-auto scrollbarVisible">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="">
                {[
                  "Profile",
                  "Name",
                  "Assign by",
                  "Department",
                  "Access",
                  "Members Email",
                  "Status",
                  "Action",
                ].map((item, index) => (
                  <th className="p-3 font-medium whitespace-nowrap" key={index}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((member, index) => (
                <tr key={index} className="">
                  <td className="p-3 ">
                    <img
                      src={member.image}
                      className="w-full h-10 object-cover rounded-md overflow-hidden"
                      alt=""
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap font-light">
                    {member.name}
                  </td>
                  <td className="p-3 whitespace-nowrap font-light">
                    {member?.createdBy?.name}
                  </td>
                  <td className="p-3 whitespace-nowrap font-light">
                    {member.role}
                  </td>
                  <td className="p-3 whitespace-nowrap font-light">
                    {member.mobile}
                  </td>
                  <td className="p-3 whitespace-nowrap font-light">
                    {member.email}
                  </td>
                  <td className="p-3 whitespace-nowrap font-light">
                    {formatDateTime(member.joiningDate)}
                  </td>
                  <td className={`p-3 `}>
                    <button
                      className={`px-2 py-1 rounded text-xs text-white ${
                        member.status === "Active"
                          ? "bg-blue-950"
                          : "bg-yellow-400"
                      }`}
                    >
                      {member.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className={`p-3 `}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigateViewDetailHandler(member._id)}
                        className="p-2 rounded text-blue-950 bg-blue-950/10"
                      >
                        <FaRegEye />
                      </button>
                      <button
                        onClick={() => togglePopup(member)}
                        className="p-2 rounded text-blue-950 bg-blue-950/10"
                      >
                        <MdModeEdit />
                      </button>
                      <button
                        onClick={() => deleteMemberHandler(member._id)}
                        className="p-2 rounded text-blue-950 bg-blue-950/10"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminMembers;
