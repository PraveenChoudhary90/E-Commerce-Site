import React, { useEffect, useState, useRef } from "react";
import { cancelOrderByAdmin, getOrderDetails } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PageLoader from "../components/ui/PageLoader";
import Swal from "sweetalert2";
import Footer1 from "../components/Footer1";

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
      <Footer1/>




      
{/* Modern Professional Invoice Modal */}
{selectedOrder && (
  <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex justify-center items-start p-4 overflow-y-auto">
    <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl relative my-4 overflow-hidden border border-gray-200">
      
      {/* Top Action Bar - Not for Print */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b no-print">
        <h2 className="text-gray-500 font-medium">Invoice Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Download PDF
          </button>
          <button
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-50 transition-all"
            onClick={() => setSelectedOrder(null)}
          >
            Close
          </button>
        </div>
      </div>

      {/* Actual Printable Invoice Content */}
      <div ref={invoiceRef} className="p-10 bg-white text-slate-800" style={{ minHeight: '297mm' }}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-900 mb-1">YOUR BRAND</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              123 Business Avenue, Suite 400<br />
              Mumbai, Maharashtra - 400001<br />
              GSTIN: 27AAAAA0000A1Z5
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light text-gray-400 uppercase tracking-widest mb-4">Invoice</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-500 uppercase font-semibold text-[10px]">Invoice No:</span> <span className="font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</span></p>
              <p><span className="text-gray-500 uppercase font-semibold text-[10px]">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        <hr className="mb-8 border-gray-100" />

        {/* Client & Payment Info */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-3">Bill To:</h4>
            <p className="font-bold text-lg text-gray-900">{selectedOrder.user?.name}</p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {selectedOrder.user?.address}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Phone:</strong> {selectedOrder.user?.contact}<br />
              <strong>Email:</strong> {selectedOrder.user?.email}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Information:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-bold uppercase ${selectedOrder.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-medium text-gray-900 font-mono text-xs">ONLINE_PAYMENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-blue-900 text-white text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">images</th>
              <th className="py-3 px-4 text-left font-medium">Description</th>
              <th className="py-3 px-4 text-center font-medium">Qty</th>
              <th className="py-3 px-4 text-right font-medium">Unit Price</th>
              <th className="py-3 px-4 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-b border-gray-200">
  {selectedOrder.products.map((p, i) => (
    <tr key={i}>
      <td className="py-2 px-4">
        {p.images?.[0] && (
          <img
            src={p.images[0]}
            alt={p.name}
            className="w-12 h-12 object-cover rounded border"
            crossOrigin="anonymous"
          />
        )}
      </td>
      <td className="py-5 px-4 text-sm">
        <p className="font-bold text-gray-900">{p.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{p.brand || 'Premium Quality'}</p>
      </td>
      <td className="py-5 px-4 text-center text-sm text-gray-600">{p.qty}</td>
      <td className="py-5 px-4 text-right text-sm text-gray-600">₹{p.user_price.toLocaleString()}</td>
      <td className="py-5 px-4 text-right text-sm font-bold text-gray-900">₹{(p.qty * p.user_price).toLocaleString()}</td>
    </tr>
  ))}
</tbody>

        </table>

        {/* Summary Calculation */}
        <div className="flex justify-end">
          <div className="w-full max-w-[280px] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal:</span>
              <span className="text-gray-900 font-semibold">₹{selectedOrder.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">GST (0%):</span>
              <span className="text-gray-900 font-semibold">₹0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Shipping:</span>
              <span className="text-green-600 font-bold text-[10px] uppercase italic">Free</span>
            </div>
            <div className="pt-3 border-t-2 border-gray-900 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900 uppercase">Grand Total:</span>
              <span className="text-2xl font-bold text-blue-900">₹{selectedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signature/Footer */}
        <div className="mt-24">
          <div className="flex justify-between items-end">
            <div className="text-[11px] text-gray-400 max-w-[300px]">
              <p className="font-bold text-gray-500 mb-1">Terms & Conditions:</p>
              <p>Items once sold are not returnable. This is a computer generated invoice and does not require a physical signature.</p>
            </div>
            <div className="text-center border-t border-gray-200 pt-2 px-8">
              <p className="text-xs font-bold text-gray-900">Authorized Signatory</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-[10px] font-bold text-gray-300 tracking-[0.5em] uppercase border-t pt-8">
              Thank you for your business
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </>
  );
};

export default OrderHistory;
