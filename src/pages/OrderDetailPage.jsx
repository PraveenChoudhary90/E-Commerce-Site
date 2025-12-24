import React, { useEffect, useState } from "react";
// import { getOrderDetails } from "../api/vendor-api";
import { getOrderDetails } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    console.log("Order Details:", order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;

    const modal = document.getElementById("order-detail-modal");
    if (!modal) return;

    // Clone modal and remove Download button
    const clone = modal.cloneNode(true);
    const downloadButton = clone.querySelector("button");
    if (downloadButton) downloadButton.remove();

    // Move clone off-screen
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    // Capture cloned modal as image
    const canvas = await html2canvas(clone, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${selectedOrder._id}.pdf`);

    document.body.removeChild(clone);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            id="order-detail-modal"
            className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative"
          >
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={handleCloseModal}
            >
              ✖
            </button>

            <div className="space-y-2 text-left max-h-[60vh] overflow-y-auto">
              <p>
                <strong>Vendor:</strong> {selectedOrder.user?.name} (
                {selectedOrder.user?.email}, {selectedOrder.user?.phone})
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address?.address},{" "}
                {selectedOrder.address?.city}, {selectedOrder.address?.state},{" "}
                {selectedOrder.address?.country} - {selectedOrder.address?.pincode}
              </p>
              <p>
                <strong>Payment Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Payment Type:</strong> {selectedOrder.paymentType}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {selectedOrder.totalAmount?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <div>
                <strong>Products:</strong>
                {selectedOrder.products?.map((p, i) => (
                  <div key={i} className="border-b mb-2 pb-1">
                    <p><strong>Code:</strong> {p.productCode || "N/A"}</p>
                    <p><strong>Qty:</strong> {p.quantity || 1}</p>
                    <p><strong>Price:</strong> ₹{p.price?.toFixed(2) || "0.00"}</p>
                    <p><strong>GST:</strong> {p.gst || "0"}%</p>
                    <p><strong>Product Name:</strong> {p.combination || "N/A"}</p>
                    <p><strong>Pack Size:</strong> {p.packSize || "N/A"}</p>
                    <p><strong>Description:</strong> {p.description || "N/A"}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleDownloadPDF}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
