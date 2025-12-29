import { useEffect, useState, useRef } from "react";
import { Send, XCircle, Eye } from "lucide-react";
import { closeSupport, getAllSupports, replySupport } from "../../api/auth-api";

const AdminSupportChat = () => {
  const [supports, setSupports] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [reply, setReply] = useState("");
  const chatEndRef = useRef(null);

  // Load all tickets
  const loadChats = async () => {
    const res = await getAllSupports();
    setSupports(res || []);
  };

  // Send admin reply
  const sendReply = async () => {
    if (!reply.trim() || !activeTicket) return;

    const updatedTicket = await replySupport(activeTicket._id, { text: reply.trim() });
    setReply("");
    setActiveTicket(updatedTicket);
    loadChats();
  };

  // Close ticket
  const closeTicket = async (id) => {
    await closeSupport(id);
    loadChats();
    if (activeTicket?._id === id) setActiveTicket(null);
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex justify-center items-start pt-10 p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-6 text-bg-color">
          🧑‍💼 Admin Support Tickets
        </h2>

        {/* TICKET TABLE */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-color text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Vendor Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supports.map((ticket, index) => (
              <tr key={ticket._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{ticket.email}</td>
                <td className="p-3">
                  {ticket.status === "open" ? (
                    <span className="text-green-600 font-semibold">Open</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Closed</span>
                  )}
                </td>
                <td className="p-3">{new Date(ticket.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setActiveTicket(ticket)}
                    className="flex items-center gap-1 text-bg-color underline"
                  >
                    <Eye size={16} /> View
                  </button>
                  {ticket.status === "open" && (
                    <button
                      onClick={() => closeTicket(ticket._id)}
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

        {/* CHAT MODAL */}
        {activeTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg flex flex-col h-[600px] p-4">

              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-lg font-semibold">
                  📝 {activeTicket.subject} - {activeTicket.email}
                </h3>
                {activeTicket.status === "open" && (
                  <button
                    onClick={() => closeTicket(activeTicket._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <XCircle size={16} /> CloseTicket
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-2 flex flex-col">
                {activeTicket.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl max-w-[75%] flex flex-col ${
                      msg.sender === "admin" ? "self-end bg-green-100" : "self-start bg-gray-100"
                    }`}
                  >
                    <span>{msg.text}</span>
                    
                    {/* Show image if present */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="mt-2 rounded max-w-full"
                      />
                    )}

                    <span className="text-xs text-gray-500 mt-1 self-end">
                      {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Admin Reply */}
              {activeTicket.status === "open" && (
                <div className="flex gap-2 mt-auto">
                  <input
                    type="text"
                    placeholder="Type your reply..."
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

              {/* Close Modal */}
              <div className="flex justify-end mt-2">
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
