import { useEffect, useState } from "react";
import { Send, XCircle, Eye } from "lucide-react";
import { closeSupport, getAllSupports, replySupport } from "../../api/auth-api";

const AdminSupportChat = () => {
  const [supports, setSupports] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [reply, setReply] = useState("");

  // Load all tickets
  const loadChats = async () => {
    const res = await getAllSupports();
    setSupports(res || []);
  };

  // Send reply
  const sendReply = async () => {
    if (!reply || !activeTicket) return;
    await replySupport(activeTicket._id, { reply });
    setReply("");
    // Keep modal open, ticket status remains open
    loadChats();
  };

  // Close ticket
  const closeTicket = async (id) => {
    await closeSupport(id);
    loadChats();
  };

  useEffect(() => {
    loadChats();
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex justify-center items-start pt-10 p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-6 text-bg-color">
          🧑‍💼 Admin Support Tickets
        </h2>

        {/* TABLE */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-color text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Vendor Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supports.map((s, index) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">
                  {s.status === "open" ? (
                    <span className="text-green-600 font-semibold">Open</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Closed</span>
                  )}
                </td>
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setActiveTicket(s)}
                    className="flex items-center gap-1 text-bg-color underline"
                  >
                    <Eye size={16} /> View
                  </button>

                  {s.status === "open" && (
                    <button
                      onClick={() => closeTicket(s._id)}
                      className="flex items-center gap-1 text-red-600"
                    >
                      <XCircle size={16} /> Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL */}
        {activeTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                📝 Ticket from {activeTicket.email}
              </h3>

              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="font-semibold mb-1">Vendor Message:</p>
                <p>{activeTicket.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(activeTicket.createdAt)}
                </p>
              </div>

              {activeTicket.adminReply && (
                <div className="bg-green-100 p-3 rounded-lg mb-4">
                  <p className="font-semibold mb-1">Your Reply:</p>
                  <p>{activeTicket.adminReply}</p>
                </div>
              )}

              {/* Reply Input */}
              {activeTicket.status === "open" && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Type reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={sendReply}
                    className="bg-bg-color text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              )}

              <div className="flex justify-between">
                {/* Close Ticket Button */}
                {activeTicket.status === "open" && (
                  <button
                    onClick={async () => {
                      await closeTicket(activeTicket._id);
                      setActiveTicket(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Close Ticket
                  </button>
                )}

                {/* Close Modal Button */}
                <button
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSupportChat;
