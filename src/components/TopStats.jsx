import React from "react";
import Button from "./Button";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const topStats1 = [
  {
    title: "Top Refer",
    items: [
      { name: "Rajat Pradhan", value: "₹5,89,300/-" },
      { name: "Sateesh Singh", value: "₹3,89,300/-" },
      { name: "Astha Vishwakarma", value: "₹1,89,300/-" },
      { name: "Rishik Raj Rajput", value: "₹1,89,300/-" },
      { name: "Rishik Raj Rajput", value: "₹1,89,300/-" },
      { name: "Aasif Ansari", value: "₹89,300/-" },
    ],
  },
];

const getProgressColor = (percentage) => {
  if (percentage > 80) {
    return "#EB5406";
  } else if (percentage > 70) {
    return "#094b85";
  } else if (percentage > 50) {
    return "#4CAF50";
  } else {
    return "#F44336";
  }
};

const TopStats = ({ topProducts, topBrands, topCategories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <TopStats1 />
      <TopStats2 title="Sales By Category" data={topCategories} />
      <TopStats2 title="Top Products" data={topProducts} />
      <TopStats2 title="Top Brands" data={topBrands} />
    </div>
  );
};

const TopStats1 = () => {
  return (
    <div>
      {topStats1.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl  p-4 space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <Button title={"Top 5"} />
          </div>
          <ul>
            {stat.items.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center py-6 border-b last:border-none">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-sm font-medium">{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const TopStats2 = ({ title, data }) => {
  return (
    <div>
      <div className="bg-white rounded-xl  p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button title={"Top 5"} />
        </div>
        <ul>
          {data?.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center py-4 border-b last:border-none">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h4 className="text-sm font-medium mr-4">{item.name}</h4>
                  <p className="text-sm font-medium">{item.totalSales}</p>
                </div>
            {item?.percentage && (
                   <div className="w-12 h-12">
                   <CircularProgressbar
                     value={item.percentage}
                     text={`${item.percentage}%`}
                     strokeWidth={8}
                     styles={{
                       path: {
                         stroke: getProgressColor(item.percentage),
                       },
                       text: {
                         fill: "#000",
                         fontSize: "20px",
                       },
                     }}
                   />
                 </div>
            )}
               
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopStats;
