import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Footer1 from "../components/Footer1";
import PageLoader from "../components/ui/PageLoader";
import { getOrderDetails } from "../api/auth-api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const invoiceRef = useRef(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetails();
        setOrders(response?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter & search
  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      filter === "all" || order.status?.toLowerCase() === filter.toLowerCase();
    const searchValue = invoiceSearch.toLowerCase();
    if (!searchValue) return statusMatch;
    const nameMatch = order.user?.name?.toLowerCase().includes(searchValue);
    const emailMatch = order.user?.email?.toLowerCase().includes(searchValue);
    const phoneMatch = order.user?.number?.toLowerCase().includes(searchValue);
    const invoceMatch = order.invoiceNumber?.toLowerCase().includes(searchValue);
    return statusMatch && (nameMatch || emailMatch || phoneMatch || invoceMatch);
  });

  // Download PDF (multi-page safe)
  const handleDownloadPDF = async () => {
  if (!invoiceRef.current || !selectedOrder) return;

  const element = invoiceRef.current;
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = pdfHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
  heightLeft -= pdf.internal.pageSize.getHeight();

  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  }

  const invoiceId = selectedOrder._id || selectedOrder.id || "UNKNOWN";
  pdf.save(`Invoice_${invoiceId.slice(-6)}.pdf`);
};

  if (loading) return <PageLoader />;

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-1">User Order History</h1>
        <p className="text-gray-600 mb-4">
          Total Orders: <strong>{filteredOrders.length}</strong>
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg min-w-52"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
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
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={() => setInvoiceSearch("")}
          >
            Clear
          </button>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-center">
              <thead>
                <tr className="bg-gray-200 whitespace-nowrap">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Invoice Number</th>
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
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.id || order._id} className="whitespace-nowrap">
                    <td className="border px-4 py-2">{i + 1}</td>
                    <td className="border px-4 py-2">
                      {order.products?.[0]?.images?.[0] && (
                        <img
                          src={order.products[0].images[0]}
                          className="w-12 h-12 object-cover rounded border mx-auto"
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {order.invoiceNumber || order._id.slice(-6)}
                    </td>
                    <td className="border px-4 py-2">{order.user?.name || "Guest"}</td>
                    <td className="border px-4 py-2">{order.user?.email || "N/A"}</td>
                    <td className="border px-4 py-2">{order.user?.number || "N/A"}</td>
                    <td className="border px-4 py-2">{order.address || "N/A"}</td>
                    <td className="border px-4 py-2">{order.total}</td>
                    <td className="border px-4 py-2">
                      {order.products.map((p) => p.name).join(", ")}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded font-bold text-white text-sm ${
                          order.status === "paid"
                            ? "bg-green-600"
                            : order.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedOrder(order)}
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
          <p className="text-center text-gray-600 mt-4">No orders found.</p>
        )}
      </div>

      <Footer1 />

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-start p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-xl shadow-2xl my-8 border border-gray-200 overflow-hidden">
            {/* Action Bar */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Preview Mode
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div
              ref={invoiceRef}
              className="p-12 text-slate-800 bg-white relative"
              style={{ minHeight: "297mm", fontFamily: "'Inter', sans-serif" }}
            >
              {/* Watermark */}
              <div className="absolute top-10 right-10 rotate-12 opacity-10">
                <h1 className="text-8xl font-black uppercase">{selectedOrder.status}</h1>
              </div>

              {/* Brand & Invoice Info */}
              <div className="flex justify-between items-start border-b-4 border-blue-900 pb-8 mb-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-blue-900 mb-2">
                    YOUR BRAND
                  </h1>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-800">Your Business Name Pvt Ltd</p>
                    <p>123 Business Avenue, Suite 400</p>
                    <p>Bhopal, MP - 462001</p>
                    <p className="mt-1">
                      <span className="font-semibold text-blue-900">GSTIN:</span> 27AAAAA0000A1Z5
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-5xl font-light text-gray-300 uppercase mb-4 tracking-tighter">
                    Tax Invoice
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-gray-500 font-semibold uppercase text-[10px]">
                        Invoice No:
                      </span>{" "}
                      <span className="font-mono font-bold text-lg text-blue-900">
                        #{selectedOrder.invoiceNumber || selectedOrder._id.slice(-6)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-semibold uppercase text-[10px]">
                        Date:
                      </span>{" "}
                      <span className="font-bold">
                        {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-semibold uppercase text-[10px]">
                        Status:
                      </span>{" "}
                      <span
                        className={`font-bold uppercase ${
                          selectedOrder.status === "paid" ? "text-green-600" : "text-orange-500"
                        }`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing & Payment */}
              <div className="grid grid-cols-2 gap-20 mb-12">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4 border-b pb-2">
                    Billing Details
                  </h4>
                  <p className="font-bold text-xl text-gray-900 mb-1">
                    {selectedOrder.user?.name || "Guest Customer"}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 leading-snug">
                    {selectedOrder.address || "No address provided"}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      <span className="font-semibold">Phone:</span> {selectedOrder.user?.number || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {selectedOrder.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-end items-end pb-4">
                  <div className="text-right">
                    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">
                      Payment Method
                    </h4>
                    <p className="text-sm font-bold text-gray-700 italic">Online Transaction</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-10 overflow-hidden rounded-lg">
                <thead>
                  <tr className="bg-blue-900 text-white text-[11px] uppercase tracking-wider">
                    <th className="py-4 px-6 text-left">Item Description</th>
                    <th className="py-4 px-6 text-center">Qty</th>
                    <th className="py-4 px-6 text-right">Unit Price</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-x border-b">
                  {selectedOrder.products.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              className="w-10 h-10 object-cover rounded-md border shadow-sm"
                              alt=""
                            />
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center font-medium text-gray-600">{p.qty}</td>
                      <td className="py-5 px-6 text-right text-gray-600">₹{p.user_price.toLocaleString()}</td>
                      <td className="py-5 px-6 text-right font-bold text-gray-900">
                        ₹{(p.qty * p.user_price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Footer */}
              <div className="flex justify-between">
                <div className="w-1/2">
                  <div className="bg-blue-50/50 p-6 rounded-xl">
                    <h4 className="text-xs font-bold text-blue-900 mb-2 underline">Terms & Conditions</h4>
                    <ul className="text-[10px] text-gray-500 space-y-1 list-disc ml-3">
                      <li>Goods once sold will not be taken back.</li>
                      <li>Subject to Bhopal Jurisdiction only.</li>
                      <li>This is a computer generated invoice.</li>
                    </ul>
                  </div>
                </div>
                <div className="w-1/3 space-y-3">
                  <div className="flex justify-between text-sm px-2">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm px-2">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-900 text-white p-4 rounded-lg shadow-lg">
                    <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                    <span className="text-2xl font-black">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="pt-8 text-center">
                    <div className="border-b border-gray-300 w-full mb-2"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      Authorized Signatory
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-[10px] text-gray-400 font-medium italic">
                  Thank you for your business! Visit us again at www.yourbrand.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
