import React, { useEffect, useState } from "react";
// import { getOrderDetails } from "../api/vendor-api";
import { getOrderDetails } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

const OrderHistory = () => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetails();
        console.log("Fetched Orders:", response);
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

  const handleDetail = (order) => {
    setSelectedOrder(order);
  };


const invoiceRef = useRef(null); 


// 3. Optimized Download Function (Size < 1MB)
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { 
      scale: 1.5, // High enough for clarity, low enough for size
      useCORS: true 
    });
    
    // JPEG use karne se size 1MB ke niche rehta hai (PNG heavy hota hai)
    const imgData = canvas.toDataURL("image/jpeg", 0.75); 
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${selectedOrder._id.slice(-6)}.pdf`);
  };



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
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Payment Type</th>
                  <th className="border px-4 py-2">Total Amount (₹)</th>
                  <th className="border px-4 py-2">Products</th>
                  <th className="border px-4 py-2">Order Date</th>
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
                    <td className="border px-4 py-2 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                      {`${order.address?.address}, ${order.address?.city}, ${order.address?.state}, ${order.address?.country} - ${order.address?.pincode}`}
                    </td>
                    <td className="border px-4 py-2">{order.paymentType}</td>
                    <td className="border px-4 py-2">
                      {order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="border px-4 py-2 text-left break-words min-w-[200px]">
                      {order.products?.map((p) => p.combination || "N/A").join(", ")}
                    </td>
                    <td className="border px-4 py-2">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
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

      {/* Modal */}
      {selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
    <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl relative my-8">
      
      {/* Action Buttons */}
      <div className="flex justify-end p-4 gap-3 bg-gray-50 border-b rounded-t-lg sticky top-0 z-10 no-print">
        <button
          onClick={handleDownloadPDF}
          className="bg-[#8e6d9d] text-white px-5 py-2 rounded shadow hover:bg-[#7a5b88] font-medium"
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

      {/* Printable Invoice */}
      <div ref={invoiceRef} className="bg-white p-0 text-gray-800">
        
        {/* Header */}
        <div className="bg-[#8e6d9d] p-10 flex justify-between items-start text-white">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              BIONOVA HEALTHCARE PVT LTD
            </h1>
            <div className="text-sm mt-3 space-y-1 opacity-90 font-medium">
              <p>Plot No. 123, Industrial Area, Phase-1</p>
              <p>Bhopal, Madhya Pradesh, India - 462001</p>
              <p>Email: info@bionovahealthcare.com</p>
              <p>GSTIN: 23AAACB1234A1Z5</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md flex flex-col items-center border-2 border-[#a68bb3]">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Logo</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#8e6d9d] text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold italic">B</div>
              <span className="text-[#8e6d9d] font-black text-2xl italic">Bionova</span>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="p-10">
          <div className="flex justify-between mb-8">
            <div className="w-1/2">
              <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase border-b pb-1">BILL TO</h2>
              <p className="font-bold text-lg text-gray-900">
                {selectedOrder.user.name}
              </p>
              <p className="text-sm text-gray-600">{selectedOrder.address?.address}</p>
              <p className="text-sm text-gray-600">
                {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
              </p>
              <p className="text-sm font-medium mt-1">Phone: +91 {selectedOrder.userId?.mobileNumber || selectedOrder.user?.phone}</p>
              <p className="text-sm font-medium mt-1">Email:  {selectedOrder.user.email}</p>
            </div>
            <div className="w-1/3 text-right">
              <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase border-b pb-1 text-right">INVOICE DETAILS</h2>
              <div className="space-y-1 text-sm">
                <p><span className="font-bold text-gray-500">Invoice No:</span> #{selectedOrder.invoiceNo}</p>
                <p><span className="font-bold text-gray-500">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p><span className="font-bold text-gray-500">Payment:</span> {selectedOrder.paymentType?.replace('_', ' ')}</p>
                <p><span className="font-bold text-gray-500">Status:</span> <span className="text-green-600 font-bold">{selectedOrder.status}</span></p>
              </div>
            </div>
          </div>

          {/* Product Table */}
          <table className="w-full border-collapse mb-8 overflow-hidden rounded-t-lg">
            <thead>
              <tr className="bg-[#8e6d9d] text-white text-[11px]">
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

          {/* Summary */}
          <div className="flex justify-between items-end">
            <div className="w-2/3">
              <h3 className="text-xl font-bold text-[#8e6d9d] italic leading-tight">
                Thank you for your business!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                We appreciate your trust in Bionova Healthcare.
              </p>
            </div>
            <div className="w-72">
              <div className="flex justify-between p-4 bg-[#8e6d9d] text-white font-black text-xl shadow-lg mt-2 rounded-sm">
                <span className="text-xs uppercase pt-2 font-bold">Total Paid</span>
                <span>₹{selectedOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 grid grid-cols-2 gap-10 border-t pt-8">
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 border-b pb-1">Payment Information</h4>
              <div className="text-[11px] space-y-1 text-gray-600">
                <p><strong>Bank:</strong> State Bank of India</p>
                <p><strong>A/c Name:</strong> Bionova Healthcare Pvt Ltd</p>
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
