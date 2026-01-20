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
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

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

  const filteredOrders = orders?.filter(
    (order) =>
      filter === "all" ||
      order.status?.toLowerCase() === filter.toLowerCase()
  );

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

const handleStatusChange = async (orderId, oldStatus, newStatus) => {
  if (oldStatus === newStatus) return;

  const result = await Swal.fire({
    title: "Confirm Status Change",
    text: `Change order status from "${oldStatus}" to "${newStatus}"?`,
    icon: newStatus === "CANCELED" ? "error" : "warning",
    showCancelButton: true,
    confirmButtonColor: newStatus === "CANCELED" ? "#d33" : "#3085d6",
    cancelButtonColor: "#aaa",
    confirmButtonText: "Yes, update",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  try {
    await cancelOrderByAdmin(orderId, newStatus);

    // 🔥 Frontend me orders ko update karo
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `Order status changed to "${newStatus}"`,
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire(
      "Error",
      error?.response?.data?.message || "Failed to update order status",
      "error"
    );
  }
};





  if (loading) {
  return <PageLoader />;
}


  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-1">Vendor Order History</h1>
        <p className="text-gray-600 mb-4">
          Total Orders: <strong>{filteredOrders.length}</strong>
        </p>

        <div className="mb-4">
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
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="border px-4 py-2">Index</th>
                  <th className="border px-4 py-2">Vendor Name</th>
                  <th className="border px-4 py-2">Vednor Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Payment Type</th>
                  <th className="border px-4 py-2">Total Amount (₹)</th>
                  <th className="border px-4 py-2">Products</th>
                  <th className="border px-4 py-2">Order Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Order Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{order.user?.name}</td>
                    <td className="border px-4 py-2">{order.user?.email}</td>
                    <td className="border px-4 py-2">{order.user?.phone}</td>
                  <td className="border px-4 py-2 text-left whitespace-nowrap overflow-x-auto">
  {`${order.address?.address}, ${order.address?.city}, ${order.address?.state}, ${order.address?.country} - ${order.address?.pincode}`}
</td>

                    <td className="border px-4 py-2">{order.paymentType}</td>
                    <td className="border px-4 py-2">{order.totalAmount?.toFixed(2) || "0.00"}</td>
                    <td className="border px-4 py-2 text-left min-w-[200px]">
                      {order.products?.map((p) => p.combination || "N/A").join(", ")}
                    </td>
                    <td className="border px-4 py-2">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
  <span
    className={`px-2 py-1 rounded font-bold text-white text-sm ${
      order.status === "PENDING"
        ? "bg-yellow-500"
        : order.status === "DISPATCHED"
        ? "bg-blue-500"
        : order.status === "SUCCESS"
        ? "bg-green-600"
        : order.status === "FAILED"
        ? "bg-red-500"
        : order.status === "CANCELED"
        ? "bg-gray-500"
        : "bg-gray-300"
    }`}
  >
    {order.status}
  </span>
</td>

                    {/* Cancel button: only if order is not Cancelled or SUCCESS */}
      <td className="border px-4 py-2">
  <select
    value={order.status}
    className="border rounded px-2 py-1 text-sm"
    onChange={(e) =>
      handleStatusChange(order._id, order.status, e.target.value)
    }
  >
    <option value="PENDING">Pending</option>
    <option value="DISPATCHED">Dispatched</option>
    <option value="SUCCESS">Success (Delivered)</option>
    <option value="FAILED">Failed</option>
    <option value="CANCELED">Cancel</option>
  </select>
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl relative my-8">
            <div className="flex justify-end p-4 gap-3 bg-gray-50 border-b rounded-t-lg sticky top-0 z-10 no-print">
              <button
                onClick={handleDownloadPDF}
                className="bg-[#085946] text-white px-5 py-2 rounded shadow hover:bg-[#085946] font-medium"
              >
                Download PDF
              </button>
              <button
                className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 font-bold"
                onClick={() => setSelectedOrder(null)}
              >
                ✕ Close
              </button>
            </div>

            <div ref={invoiceRef} className="bg-white p-0 text-gray-800 w-full max-w-full">
              <div className="bg-[#085946] p-10 flex flex-col md:flex-row justify-between items-start text-white">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tighter">
                    PHARAMA SATTI PVT LTD
                  </h1>
                  <div className="text-sm mt-3 space-y-1 opacity-90 font-medium">
                    <p>Plot No. 123, Industrial Area, Phase-1</p>
                    <p>Bhopal, Madhya Pradesh, India - 462001</p>
                    <p>Email: info@pharamasatti.com</p>
                    <p>GSTIN: 23AAACB1234A1Z5</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md flex flex-col items-center border-2 border-[#085946] mt-5 md:mt-0">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Logo</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#085946] text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold italic">P</div>
                    <span className="text-[#085946] font-black text-2xl italic">Pharama Satti</span>
                  </div>
                </div>
              </div>

              <div className="p-10">
                <div className="flex flex-col md:flex-row justify-between mb-8">
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase border-b pb-1">BILL TO</h2>
                    <p className="font-bold text-lg text-gray-900">{selectedOrder.user.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.address?.address}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
                    <p className="text-sm font-medium mt-1">Phone: +91 {selectedOrder.userId?.mobileNumber || selectedOrder.user?.phone}</p>
                    <p className="text-sm font-medium mt-1">Email: {selectedOrder.user.email}</p>
                  </div>
                  <div className="w-full md:w-1/3 text-right">
                    <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase border-b pb-1 text-right">INVOICE DETAILS</h2>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-bold text-gray-500">Invoice No:</span> #{selectedOrder.invoiceNo}</p>
                      <p><span className="font-bold text-gray-500">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      <p><span className="font-bold text-gray-500">Payment:</span> {selectedOrder.paymentType?.replace('_', ' ')}</p>
                      <p><span className="font-bold text-gray-500">Status:</span> <span className="text-green-600 font-bold">{selectedOrder.status}</span></p>
                    </div>
                  </div>
                </div>

                <table className="w-full border-collapse mb-8 overflow-hidden rounded-t-lg text-sm">
                  <thead>
                    <tr className="bg-[#085946] text-white text-[11px]">
                      <th className="p-4 text-left uppercase">Product & Description</th>
                      <th className="p-4 text-center uppercase">Qty</th>
                      <th className="p-4 text-right uppercase">Price</th>
                      <th className="p-4 text-right uppercase">GST %</th>
                      <th className="p-4 text-right uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {selectedOrder.products?.map((p, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-bold text-gray-800 text-base">{p.combination}</div>
                          <div className="text-[11px] text-gray-500 italic leading-tight mt-1">{p.description}</div>
                        </td>
                        <td className="p-4 text-center text-gray-700">{p.quantity}</td>
                        <td className="p-4 text-right text-gray-700">₹{p.price.toFixed(2)}</td>
                        <td className="p-4 text-right text-gray-400">{p.gst}%</td>
                        <td className="p-4 text-right font-bold text-gray-900">₹{(p.price * p.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex flex-col md:flex-row justify-between items-end">
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold text-[#085946] italic leading-tight">Thank you for your business!</h3>
                    <p className="text-sm text-gray-500 mt-1">We appreciate your trust in Pharama satti.</p>
                  </div>
                  <div className="w-full md:w-72 mt-4 md:mt-0">
                    <div className="flex justify-between p-4 bg-[#085946] text-white font-black text-xl shadow-lg mt-2 rounded-sm">
                      <span className="text-xs uppercase pt-2 font-bold">Total Paid</span>
                      <span>₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t pt-8">
                  <div>
                    <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 border-b pb-1">Payment Information</h4>
                    <div className="text-[11px] space-y-1 text-gray-600">
                      <p><strong>Bank:</strong> State Bank of India</p>
                      <p><strong>A/c Name:</strong> Pharama Satti Pvt Ltd</p>
                      <p><strong>A/c No:</strong> 334455667788</p>
                      <p><strong>IFSC:</strong> SBIN0001234</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 border-b pb-1">Terms & Conditions</h4>
                    <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                      <li>All disputes are subject to Bhopal Jurisdiction.</li>
                      <li>Invoice generated via Digital Wallet.</li>
                      <li>Goods once sold are not returnable.</li>
                    </ul>
                  </div>
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
