import React from "react";

const Graph = () => {
    return (
        <div className="bg-white p-4 rounded-xl border border-[#EFF0F6] space-y-3">
            <div>
                <p className="font-semibold">Graphs Report</p>
            </div>
            <div>
                {[
                    { country: "United States", color: "#3B82F6", points: 150 },
                    { country: "Australia", color: "#06B6D4", points: 145 },
                    { country: "Russia", color: "#FB923C", points: 500 },
                    { country: "Canada", color: "#EF4444", points: 265 },
                    { country: "Mayotte", color: "#EC4899", points: 239 },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center mt-5"
                    >
                        <span className="text-sm w-1/12">{item.country}</span>
                        <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full relative">
                            <div
                                className={`absolute top-0 left-0 h-1 bg-[${item.color}] rounded-full`}
                                style={{
                                    backgroundColor: item.color,
                                    width: `${(item.points / 500) * 100}%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-sm">{item.points}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Graph;
