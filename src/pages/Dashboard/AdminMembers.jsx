import { useState, useEffect } from "react";
import { getMembers } from "../../api/auth-api";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { Routers } from "../../constants/Routes";

// Placeholder images
const DEFAULT_USER_IMG = "https://via.placeholder.com/150?text=User";
const DEFAULT_AADHAAR_IMG = "https://via.placeholder.com/150?text=Aadhaar";
const DEFAULT_PAN_IMG = "https://via.placeholder.com/150?text=PAN";

const AdminMembers = () => {
  const [memberData, setMemberData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMembers()
      .then((res) => {
        // Show only latest 10 members
        setMemberData(res.slice(0, 10));
      })
      .catch((err) => console.error("Error fetching members:", err));
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold">Latest 10 MR Members</h3>
      <Button 
  title="View All"  
  link={Routers.MANAGE_MEMBERS} 
  className=" text-white"
/>
      </div>

      {memberData.length === 0 ? (
        <p className="text-center mt-10">No members found!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                {[
                  "Profile Image",
                  "Name",
                  "Mobile",
                  "Email",
                  "Status",
                  "PAN Image",
                  "PAN Number",
                  "Aadhaar Image",
                  "Location",
                ].map((item, index) => (
                  <th key={index} className="p-3 font-medium border-b">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {memberData.map((member, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">
                    <img
                      src={member.userPicUrl || DEFAULT_USER_IMG}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">{member.name}</td>
                  <td className="p-3">{member.mobile}</td>
                  <td className="p-3">{member.email}</td>
                  <td className="p-3">{member.status}</td>
                  <td className="p-3">
                    <img
                      src={member.panPicUrl || DEFAULT_PAN_IMG}
                      alt="PAN"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">{member.panNumber || "-"}</td>
                  <td className="p-3">
                    <img
                      src={member.aadhaarPicUrl || DEFAULT_AADHAAR_IMG}
                      alt="Aadhaar"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">India</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
