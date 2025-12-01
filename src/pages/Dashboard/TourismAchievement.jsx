import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const TourismAchievement = ({ img, bgcolor }) => {
    return (
        <div
            style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className={`lg:h-[100vh] ${bgcolor} w-full grid md:grid-cols-2 grid-cols-1 overflow-hidden rounded-xl text-white p-6`}
        >
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="md:text-2xl lg:text-3xl text-xl font-semibold text-bg-color">
                        Report Country Wise Sales
                    </h1>
                    <p className="text-sm text-gray-800 font-medium mt-2">
                        Live Reporting
                    </p>
                </div>
                <div className="flex  gap-4 items-center justify-between md:justify-start">
                    <button className="bg-gray-700 px-4 py-2 rounded-lg text-sm">
                        <IoIosArrowBack />
                    </button>
                    <div className="flex gap-4 items-center overflow-x-auto scrollbar-hide">
                        <button className="bg-bg-color px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                            Africa
                        </button>
                        <button className="bg-gray-800 px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                            United States
                        </button>
                        <button className="bg-gray-800 px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                            United Kingdom
                        </button>
                    </div>
                    <button className="bg-gray-700 px-4 py-2 rounded-lg text-sm">
                        <IoIosArrowForward />
                    </button>
                </div>

                <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <div className="flex gap-2 items-center justify-between ">
                        <h2 className="md:text-xl text-sm font-medium">
                            Your Current Level
                        </h2>
                        <div>
                            <select
                                name=""
                                id=""
                                className="bg-transparent text-white border p-2 rounded"
                            >
                                <option
                                    className="text-black"
                                    value="Select Level Price"
                                >
                                    Select Level Price
                                </option>
                                <option className="text-black" value="20,000/-">
                                    20,000/-
                                </option>
                                <option className="text-black" value="10,000/-">
                                    10,000/-
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center mt-4">
                        <span className="text-3xl font-medium text-white">
                            Level 3
                        </span>
                        <span className="text-sm text-green-400">+12%</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        Compared Achievement Tourism
                    </p>
                    <div className="mt-6">
                        {[
                            {
                                country: "United States",
                                color: "#3B82F6",
                                points: "50,000/-",
                            },
                            {
                                country: "Australia",
                                color: "#06B6D4",
                                points: "10,000/-",
                            },
                            {
                                country: "Russia",
                                color: "#FB923C",
                                points: "20,000/-",
                            },
                            {
                                country: "Canada",
                                color: "#EF4444",
                                points: "30,000/-",
                            },
                            {
                                country: "Mayotte",
                                color: "#EC4899",
                                points: "50,000/-",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center mt-5"
                            >
                                <span className="text-sm">{item.country}</span>
                                <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full relative">
                                    <div
                                        className={`absolute top-0 left-0 h-2 bg-[${item.color}] rounded-full`}
                                        style={{
                                            backgroundColor: item.color,
                                            width: `${(index + 1) * 20}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm">{item.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="hidden  relative md:flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl"></div>
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {[
                        {
                            position: "top-1/4 left-1/3",
                            label: "Sudan",
                            value: "12,8392",
                        },
                        {
                            position: "top-1/2 left-2/3",
                            label: "Canada",
                            value: "30,000",
                        },
                    ].map((point, index) => (
                        <div
                            key={index}
                            className={`absolute ${point.position} flex flex-col items-center`}
                        >
                            <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                            <div className="mt-2 bg-gray-800 text-white text-xs p-2 rounded-lg shadow-md">
                                <span>{point.label}</span>
                                <br />
                                <span>{point.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TourismAchievement;
