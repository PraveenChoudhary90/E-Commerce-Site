import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";
import ReferalButton from "./ReferalButton";

import { FaArrowCircleRight, FaShoppingCart, FaChartLine, FaRegTimesCircle, FaUsers } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";

const Dashboard = () => {
  const [loading] = useState(false);

  const stats = [
    {
      title: "Today's Sales",
      value: "12,450",
      icon: <FaShoppingCart />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500", // Dynamic Gradient
      footerText: "More info",
    },
    {
      title: "Total Sales",
      value: "5,8200",
      icon: <FaChartLine />,
      color: "bg-gradient-to-r from-emerald-500 to-green-600",
      footerText: "View report",
    },
    {
    title: "Today Cancelled Orders",
    value: "5",
    icon: <FaRegTimesCircle />,
    color: "bg-gradient-to-r from-rose-500 to-blue-600",// Warning Orange (Distinct)
    footerText: "Check details",
  },
    {
      title: "All Cancelled Orders",
      value: "14",
      icon: <FaRegTimesCircle />,
      color: "bg-gradient-to-r from-rose-500 to-red-600",
      footerText: "Check details",
    },
    {
      title: "Active Users",
      value: "450",
      icon: <FaUsers />,
      color: "bg-gradient-to-r from-amber-400 to-orange-500",
      footerText: "Manage users",
    },
  ];

  return (
    <>
      {loading && <PageLoader />}
      
      <div className="p-4 md:p-8 bg-[#f4f7f6] min-h-screen font-sans">
        
        {/* --- E-COMMERCE SLIDER --- */}
        <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
          <Swiper
            spaceBetween={0}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="h-56 md:h-80"
          >
            {[
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", // Fashion Store
              "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop"  // Marketplace
            ].map((url, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full">
                  <img src={url} alt="Ecom Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-10">
                    <div className="max-w-md">
                      <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        GROW YOUR <br />
                        <span className="text-yellow-400">BUSINESS</span> ONLINE
                      </h2>
                      <p className="text-gray-200 mt-2 hidden md:block">Analyze your sales, manage users, and scale your empire.</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- UPGRADED STATS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div 
              key={index} 
              className={`${item.color} rounded-xl shadow-lg text-white overflow-hidden relative group transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div className="p-6">
                <div className="relative z-10">
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{item.title}</p>
                  <h3 className="text-4xl font-black flex items-center gap-1">
                    {item.title.toLowerCase().includes("sales") || item.title.toLowerCase().includes("revenue") ? (
                      <><LiaRupeeSignSolid className="text-3xl" />{item.value}</>
                    ) : (
                      item.value
                    )}
                  </h3>
                </div>
                
                {/* Icon Background - Animated on Hover */}
                <div className="absolute top-4 right-4 text-white/20 text-7xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-white/30">
                  {item.icon}
                </div>
              </div>

              {/* Bottom Interactive Bar */}
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
    </>
  );
};

export default Dashboard;