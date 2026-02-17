import React, { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaArrowCircleRight, FaShoppingCart, FaChartLine, FaRegTimesCircle, FaUsers } from "react-icons/fa";

import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";
import { getOrderDetails } from "../../api/auth-api";
import Banner from "./Banner";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetails();
        setOrders(response?.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Calculate stats dynamically
  const today = new Date();
  const isToday = (date) => {
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  const successfulOrders = orders.filter(o => o.status === "SUCCESS" || o.status === "paid");
  const cancelledOrders = orders.filter(o => o.status === "CANCELED");
  const todayOrders = orders.filter(o => isToday(o.createdAt));
  const todayCancelled = todayOrders.filter(o => o.status === "CANCELED");
  const uniqueUsers = [...new Set(orders.map(o => o.user?._id))];

  const stats = [
    {
      title: "Today's Sales",
      value: successfulOrders.filter(o => isToday(o.createdAt)).reduce((sum, o) => sum + Number(o.total), 0).toLocaleString(),
      icon: <FaShoppingCart />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      footerText: "More info",
    },
    {
      title: "Total Sales",
      value: successfulOrders.reduce((sum, o) => sum + Number(o.total), 0).toLocaleString(),
      icon: <FaChartLine />,
      color: "bg-gradient-to-r from-emerald-500 to-green-600",
      footerText: "View report",
    },
    {
      title: "Today Cancelled Orders",
      value: todayCancelled.length,
      icon: <FaRegTimesCircle />,
      color: "bg-gradient-to-r from-rose-500 to-blue-600",
      footerText: "Check details",
    },
    {
      title: "All Cancelled Orders",
      value: cancelledOrders.length,
      icon: <FaRegTimesCircle />,
      color: "bg-gradient-to-r from-rose-500 to-red-600",
      footerText: "Check details",
    },
    {
      title: "Active Users",
      value: uniqueUsers.length,
      icon: <FaUsers />,
      color: "bg-gradient-to-r from-amber-400 to-orange-500",
      footerText: "Manage users",
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 md:p-8  bg-[#f4f7f6] min-h-screen font-sans">
      {/* --- Dynamic Banner --- */}
      <Banner />

      {/* --- DYNAMIC STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {stats.map((item, index) => (
          <div key={index} className={`${item.color} rounded-xl shadow-lg text-white overflow-hidden relative group transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl`}>
            <div className="p-6">
              <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{item.title}</p>
                <h3 className="text-4xl font-black flex items-center gap-1">
                  {item.title.toLowerCase().includes("sales") ? (
                    <><LiaRupeeSignSolid className="text-3xl" />{item.value}</>
                  ) : item.value}
                </h3>
              </div>
              <div className="absolute top-4 right-4 text-white/20 text-7xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-white/30">
                {item.icon}
              </div>
            </div>
            <button className="w-full bg-black/20 py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-black/40 transition-all">
              {item.footerText} <FaArrowCircleRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <Footer1 />
      </div>
    </div>
  );
};

export default Dashboard;
