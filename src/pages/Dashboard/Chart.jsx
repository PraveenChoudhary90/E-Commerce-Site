import React from "react";
import LineChart from "./LineChart";
import SplineChart from "./SplineChart";

const Chart = () => {
    return (
        <div className="">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                    <div className="">
                        <LineChart />
                    </div>
                    <h2 className="md:text-lg  font-semibold text-gray-800 mb-4">
                        Refer Details
                    </h2>
                    <p className="text-sm text-green-600 mb-6">
                        (+23) than last week
                    </p>
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-center">
                            <p className="md:text-sm font-medium text-gray-900">
                                32,984
                            </p>
                            <p className="text-sm text-gray-500">Users</p>
                        </div>
                        <div className="text-center">
                            <p className="md:text-sm font-medium text-gray-900">
                                2.42m
                            </p>
                            <p className="text-sm text-gray-500">
                                Refer Clicks
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="md:text-sm font-medium text-gray-900">
                                ₹21,00,400
                            </p>
                            <p className="text-sm text-gray-500">Income</p>
                        </div>
                        <div className="text-center">
                            <p className="md:text-sm font-medium text-gray-900">
                                320
                            </p>
                            <p className="text-sm text-gray-500">Products</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Profit Overview
                        </h2>
                        <select className="text-sm bg-gray-100 p-2 rounded-md">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <p className="text-sm text-green-600 mb-4">
                        (+5) more Today
                    </p>
                    <div className="">
                        <SplineChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;
