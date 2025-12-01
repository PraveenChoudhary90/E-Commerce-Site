import React, { useState } from "react";
import Footer1 from "../../components/Footer1";
import { IoCalendarNumberOutline } from "react-icons/io5";
import Button from "../../components/Button";

const EarningManagement = () => {

  return (
    <div className="space-y-7">
      <div className="bg-white p-3 space-y-3 rounded-xl  flex items-center justify-between gap-5">
        <h2 className="text-2xl font-medium text-gray-700">Income</h2>
        <p className="text-bg-color lg:text-3xl md:text-2xl text-xl font-medium">
          ₹20000000.50
        </p>
      </div>
      <div></div>
      <Footer1 />
    </div>
  );
};

export default EarningManagement;
