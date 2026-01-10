import { useEffect, useState, useRef } from "react";
import { Send, XCircle, Eye } from "lucide-react";
import { closeSupport, getAllSupports, replySupport } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";


const AdminSupportChat = () => {
  const [supports, setSupports] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const chatEndRef = useRef(null);

  const loadChats = async () => {
    const res = await getAllSupports();
    setSupports(res || []);
  };

  const sendReply = async () => {
    if (!reply.trim() || !activeTicket) return;

    const updatedTicket = await replySupport(activeTicket._id, { text: reply.trim() });
    setReply("");
    setActiveTicket(updatedTicket);
    loadChats();
  };

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




  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex justify-center items-start pt-10 p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-4 md:p-6 overflow-x-auto">

        {/* HEADER */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-bg-color">
          🧑‍💼 Admin Support Tickets
        </h2>

        {/* TICKET TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-bg-color text-white text-sm md:text-base">
                <th className="p-2 md:p-3 text-left">#</th>
                <th className="p-2 md:p-3 text-left">Vendor Email</th>
                <th className="p-2 md:p-3 text-left">Status</th>
                <th className="p-2 md:p-3 text-left">Date</th>
                <th className="p-2 md:p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base">
              {supports.map((ticket, index) => (
                <tr key={ticket._id} className="border-b hover:bg-gray-50">
                  <td className="p-1 md:p-3">{index + 1}</td>
                  <td className="p-1 md:p-3">{ticket.email}</td>
                  <td className="p-1 md:p-3">
                    {ticket.status === "open" ? (
                      <span className="text-green-600 font-semibold">Open</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Closed</span>
                    )}
                  </td>
                  <td className="p-1 md:p-3">{new Date(ticket.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-1 md:p-3 flex flex-wrap gap-1 md:gap-2">
                    <button
                      onClick={() => setActiveTicket(ticket)}
                      className="flex items-center gap-1 text-bg-color underline text-xs md:text-sm"
                    >
                      <Eye size={16} /> View
                    </button>
                    {ticket.status === "open" && (
                      <button
                        onClick={() => closeTicket(ticket._id)}
                        className="flex items-center gap-1 text-red-600 text-xs md:text-sm"
                      >
                        <XCircle size={16} /> Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CHAT MODAL */}
        {activeTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2 md:p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-md md:max-w-lg rounded-xl shadow-lg flex flex-col h-[600px] md:h-[700px] p-2 md:p-4">

              {/* Modal Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-2 gap-2 md:gap-0">
                <h3 className="text-base md:text-lg font-semibold break-words">
                  📝 {activeTicket.subject} - {activeTicket.email}
                </h3>
                {activeTicket.status === "open" && (
                  <button
                    onClick={() => closeTicket(activeTicket._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs md:text-sm flex items-center gap-1"
                  >
                    <XCircle size={16} /> CloseTicket
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-2 flex flex-col px-1 md:px-0">
                {activeTicket.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 md:p-3 rounded-xl max-w-[75%] flex flex-col break-words ${
                      msg.sender === "admin" ? "self-end bg-green-100" : "self-start bg-gray-100"
                    }`}
                  >
                    <span className="break-words">{msg.text}</span>
                    
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="mt-2 rounded max-w-full"
                      />
                    )}

                    <span className="text-[10px] md:text-xs text-gray-500 mt-1 self-end">
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
                <div className="flex flex-col md:flex-row gap-2 mt-auto">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm md:text-base"
                  />
                  <button
                    onClick={sendReply}
                    className="bg-bg-color text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm md:text-base"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              )}

              {/* Close Modal */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 border rounded-lg text-sm md:text-base"
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
