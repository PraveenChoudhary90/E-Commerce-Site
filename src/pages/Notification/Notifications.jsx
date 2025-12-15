import { useEffect, useState } from "react";
import { Send, XCircle } from "lucide-react";
import { closeSupport, getAllSupports, replySupport } from "../../api/auth-api";


const AdminSupportChat = () => {
  const [supports, setSupports] = useState([]);
  const [reply, setReply] = useState("");
  const [activeId, setActiveId] = useState(null);

  const loadChats = async () => {
    const res = await getAllSupports();
    setSupports(res);
  };

  const sendReply = async () => {
    if (!reply || !activeId) return;
    await replySupport(activeId, { reply });
    setReply("");
    setActiveId(null);
    loadChats();
  };

  const closeTicket = async (id) => {
    await closeSupport(id);
    loadChats();
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="bg-bg-color text-white px-6 py-4 text-lg font-semibold">
          🧑‍💼 Admin Support Chat
        </div>

        {/* CHAT */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-gray-50">
          {supports.map((s) => (
            <div key={s._id} className="space-y-2">

              {/* Vendor */}
              <div className="flex justify-end">
                <div className="bg-bg-color text-white px-4 py-2 rounded-2xl max-w-sm">
                  <span className="text-xs block opacity-80 mb-1">
                    {s.email}
                  </span>
                  {s.message}
                </div>
              </div>

              {/* Admin */}
              {s.adminReply && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-2xl max-w-sm">
                    {s.adminReply}
                  </div>
                </div>
              )}

              {/* Actions */}
              {s.status === "open" && (
                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => setActiveId(s._id)}
                    className="text-bg-color underline"
                  >
                    Reply
                  </button>

                  <button
                    onClick={() => closeTicket(s._id)}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <XCircle size={14} /> Close
                  </button>
                </div>
              )}

              {s.status === "closed" && (
                <p className="text-xs text-red-500 font-semibold">
                  ❌ Ticket Closed
                </p>
              )}
            </div>
          ))}
        </div>

        {/* INPUT */}
        {activeId && (
          <div className="p-4 border-t flex gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type reply..."
              className="flex-1 px-4 py-2 border rounded-full"
            />
            <button
              onClick={sendReply}
              className="bg-bg-color text-white p-3 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportChat;
