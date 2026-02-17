import React, { useEffect, useState, useRef } from "react";
import { cancelOrderByAdmin, getOrderDetails } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PageLoader from "../components/ui/PageLoader";
import Swal from "sweetalert2";

const OrderHistory = () => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const invoiceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetails();
        setOrders(response?.data || response || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders?.filter((order) => {
    const statusMatch =
      filter === "all" || order.status?.toLowerCase() === filter.toLowerCase();

    const searchValue = invoiceSearch.toLowerCase();
    if (!searchValue) return statusMatch;

    const phoneMatch = String(order.user?.contact || "").toLowerCase().includes(searchValue);
    const nameMatch = (order.user?.name || "").toLowerCase().includes(searchValue);
    const emailMatch = (order.user?.email || "").toLowerCase().includes(searchValue);

    return statusMatch && (phoneMatch || nameMatch || emailMatch);
  });

  const handleDetail = (order) => setSelectedOrder(order);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const element = invoiceRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${selectedOrder._id.slice(-6)}.pdf`);
  };

  const STATUS_TRANSITIONS = {
    PENDING: ["SUCCESS", "CANCELED"],
    SUCCESS: [],
    CANCELED: [],
  };

  const handleStatusChange = async (orderId, oldStatus, newStatus) => {
    if (oldStatus === newStatus) return;

    if (!STATUS_TRANSITIONS[oldStatus].includes(newStatus)) {
      return Swal.fire(
        "Not Allowed",
        `Order is already ${oldStatus} and cannot be changed to ${newStatus}.`,
        "warning"
      );
    }

    const result = await Swal.fire({
      title: "Confirm Status Change",
      text: `Change order status from "${oldStatus}" to "${newStatus}"?`,
      icon: newStatus === "CANCELED" ? "error" : "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "CANCELED" ? "#d33" : "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, update",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelOrderByAdmin(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      Swal.fire("Updated", "Order status updated", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-1">User Order History</h1>
        <p className="text-gray-600 mb-4">
          Total Orders: <strong>{filteredOrders.length}</strong>
        </p>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <select
            className="p-2 border min-w-52 border-gray-300 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="failed">Failed</option>
          </select>

          <input
            type="text"
            placeholder="Search by Name, Email or Phone"
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg min-w-60"
          />

          <button
            onClick={() => setInvoiceSearch("")}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
          >
            Clear
          </button>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center whitespace-nowrap">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Total (₹)</th>
                  <th className="border px-4 py-2">Products</th>
                  <th className="border px-4 py-2">Order Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className="whitespace-nowrap">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {order.products?.[0]?.images?.[0] && (
                        <img
                          src={order.products[0].images[0]}
                          className="w-12 h-12 object-cover rounded border mx-auto"
                          crossOrigin="anonymous"
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2 whitespace-nowrap overflow-x-auto">
                      {order.user?.name}
                    </td>
                    <td className="border px-4 py-2">{order.user?.email || "N/A"}</td>
                    <td className="border px-4 py-2">{order.user?.contact || "N/A"}</td>
                    <td className="border px-4 py-2 whitespace-nowrap overflow-x-auto">
                      {order.user?.address}
                    </td>
                    <td className="border px-4 py-2">{order.total}</td>
                    <td className="border px-4 py-2">
                      {order.products?.map((p) => p.name).join(", ")}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded font-bold text-white text-sm ${
                          order.status === "paid"
                            ? "bg-green-600"
                            : order.status === "created"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-bg-color hover:underline"
                        onClick={() => handleDetail(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4 text-center">No orders found.</p>
        )}
      </div>
{/* Modern Professional Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-start p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative my-8 overflow-hidden">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center p-5 border-b bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                   Download Invoice
                </button>
                <button
                  className="bg-white border border-gray-200 text-gray-400 px-4 py-2 rounded-xl hover:text-red-500 transition-all font-bold"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Invoice Area */}
            <div ref={invoiceRef} className="p-12 bg-white text-gray-800">
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">INVOICE</h1>
                  <p className="text-teal-600 font-bold tracking-widest text-xs uppercase">#{selectedOrder._id.slice(-12).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-gray-900 italic">YOUR BRAND</h2>
                  <p className="text-xs text-gray-400 font-medium">www.yourstore.com</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-16 mb-12 border-y border-gray-100 py-10">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Customer Details</p>
                  <p className="text-xl font-bold text-gray-900 mb-1">{selectedOrder.user?.name}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{selectedOrder.user?.address}</p>
                  <div className="text-sm font-medium space-y-1">
                    <p><span className="text-gray-400">Phone:</span> {selectedOrder.user?.contact}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Order Summary</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400">Order Date</p>
                      <p className="font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment Status</p>
                      <p className={`text-sm font-black uppercase ${selectedOrder.status === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>
                        ● {selectedOrder.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Items Table */}
              <div className="mb-10">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-900">
                      <th className="py-4 text-left">Product Image & Description</th>
                      <th className="py-4 text-center">Qty</th>
                      <th className="py-4 text-right">Unit Price</th>
                      <th className="py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.products.map((p, i) => (
                      <tr key={i}>
                        <td className="py-6 flex items-center gap-5">
                          {/* Yahan image ek ek karke dikhegi har row mein */}
                          <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm">
                            <img 
                              src={p.images?.[0]} 
                              alt={p.name} 
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg uppercase tracking-tight">{p.name}</p>
                            <p className="text-xs text-teal-600 font-bold">{p.brand || 'Premium Edition'}</p>
                          </div>
                        </td>
                        <td className="py-6 text-center font-bold text-gray-600">×{p.qty}</td>
                        <td className="py-6 text-right font-medium text-gray-400">₹{p.user_price}</td>
                        <td className="py-6 text-right font-black text-gray-900 text-lg">₹{p.qty * p.user_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-end pt-6 border-t-4 border-gray-900">
                <div className="w-full max-w-[280px] space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold text-gray-900">₹{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Shipping</span>
                    <span className="text-green-600 font-bold italic">FREE</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-900 text-white p-5 rounded-2xl shadow-xl shadow-gray-200">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Grand Total</span>
                    <span className="text-2xl font-black">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-20 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Thank You For Your Business</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
