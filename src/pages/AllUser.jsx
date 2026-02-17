import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerListToVerify } from "../api/auth-api";
import PageLoader from "../components/ui/PageLoader";
import Swal from "sweetalert2";
import Footer1 from "../components/Footer1";

const UserList = ({ title }) => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      setIsLoading(true);
      const res = await getSellerListToVerify(); // GET API call
      setUserList(res.user || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <PageLoader />}

      <div className="flex flex-col min-h-screen p-5 bg-white">
        {/* Main Content */}
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-4">{title}</h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">SL</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Number</th>
                  <th className="border p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((item, index) => (
                  <tr key={item._id}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">{item.name}</td>
                    <td className="border p-2 text-center">{item.email}</td>
                    <td className="border p-2 text-center">{item.number}</td>
                    <td className="border p-2 text-center">{item.role}</td>
                  </tr>
                ))}
                {userList.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer stays at bottom */}
        <div className="mt-auto">
          <Footer1 />
        </div>
      </div>
    </>
  );
};

export default UserList;
