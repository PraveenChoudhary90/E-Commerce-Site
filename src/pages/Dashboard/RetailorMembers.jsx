import React from "react";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { Routers } from "../../constants/Routes";

const RetailorMembers = () => {
  const members = useSelector((state) => state.vendorData.vendorData);

  // 👇 Data safe check
  const isLoading = !members || !members.data;

  // Latest 10 vendors
  const displayData = members?.data?.slice(0, 10) || [];

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Latest 10 Vendor Members</h3>

        <Button
          title="View All"
          link={Routers.VENDOR_MANAGEMENT}
          className="text-white"
        />
      </div>

      {/* 🔄 Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-500 animate-pulse">
            Loading vendors...
          </span>
        </div>
      ) : (
        /* 📋 Table */
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">SL</th>
                <th className="p-2 border">Vendor Name</th>
                <th className="p-2 border">Vendor ID</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">KYC Status</th>
              </tr>
            </thead>

            <tbody>
              {displayData.length > 0 ? (
                displayData.map((member, index) => (
                  <tr key={member._id}>
                    <td className="p-2 border text-center">
                      {index + 1}
                    </td>
                    <td className="p-2 border text-center">
                      {member.vendorName || "-"}
                    </td>
                    <td className="p-2 border text-center">
                      {member.franchiseeId || "-"}
                    </td>
                    <td className="p-2 border text-center">
                      {member.companyName || "-"}
                    </td>
                    <td
                      className={`p-2 border text-center font-medium ${
                        member.kycStatus === "approved"
                          ? "text-green-600"
                          : member.kycStatus === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {member.kycStatus}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center font-light">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RetailorMembers;
