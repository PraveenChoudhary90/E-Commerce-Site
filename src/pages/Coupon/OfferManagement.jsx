import React, { useState } from "react";
import { motion } from "framer-motion";
import AddCoupon from "./AddCoupon";
import AddSpecialOffer from "./AddSpecialOffer";

const OfferManagement = () => {
  const tabs = ["Coupon", "Special Offer"];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full ">
      <div className="flex  p-1 rounded-lg">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`relative flex-1 p-3 px-8 text-center font-medium text-xs md:text-sm transition duration-300 ${
              activeTab === index ? "text-white" : "text-gray-700"
            }`}
          >
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#085946] rounded-lg z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <div className="p-4 ">
        {activeTab === 0 ? (
          <AddCoupon/>
        ) : (
          <AddSpecialOffer/>
        )}
      </div>
    </div>
  );
};

export default OfferManagement;
