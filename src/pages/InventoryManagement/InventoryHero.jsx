import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const InventoryHero = ({ data }) => {
  // console.log(data);

  const availableStock = data.filter((product) => product.stock > 0);
  const outOfStock = data.filter((product) => product.stock === 0);

  const totalStock = data.length;
  const availablePercentage = totalStock > 0 ? (availableStock.length / totalStock) * 100 : 0;
  const outOfStockPercentage = totalStock > 0 ? (outOfStock.length / totalStock) * 100 : 0;

  const pieData = {
    labels: ["Out of Stock", "Available"],
    datasets: [
      {
        data: [outOfStockPercentage, availablePercentage],
        backgroundColor: ["#FBBF24", "#34D399"],
      },
    ],
  };

  const totalStockValue = data
    .map(item => item.stock * item.price)
    .reduce((acc, curr) => acc + curr, 0);
  const formattedStockValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalStockValue);



  const months = data.map(item => {
    const date = new Date(item.updatedAt);
    return date.toLocaleString("en-US", { month: "short" });
  });

  const stockValues = data.map(item => item.stock);

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Stock Increase",
        data: stockValues,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.5)",
        fill: true,
      },
    ],
  };

  const products = data.slice(0, 7);

  const variantCount = data.reduce((acc, product) => {
    const key = product?.variant?.name;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  console.log(variantCount);

  return (
    <div className="w-full rounded-xl grid lg:grid-cols-3 md:grid-cols-2 gap-5 grid-cols-1 bg-white p-4">
      <div className=" flex flex-col gap-5">
        <div className=" space-y-10 border rounded-xl bg-white  p-5">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">
              {formattedStockValue}
            </h2>
            <p className="text-xs text-gray-500">
              Your Current Stock Value
              <br />
              <span className="text-[#32C98D]">20% (₹520,000)</span> Stock
              content increased by last month
            </p>
          </div>
          <button className="bg-[#32C98D] w-full text-white px-4 py-2 rounded-md mt-4">
            Add More Stock
          </button>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Available Stock: <span className="font-medium">{availablePercentage.toFixed(2)}%</span>
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-[#32C98D] h-2 rounded-full"
                style={{ width: `${availablePercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Out of Stock: <span className="font-medium">{outOfStockPercentage.toFixed(2)}%</span>
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${outOfStockPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className=" border rounded-xl bg-white p-5">
          <p className="text-sm text-gray-500 mb-4">Stock increased by last month</p>
          <div>
            <Line data={lineData} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="border rounded-xl bg-white p-5">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Total Low Stock</h2>

          <div className="relative w-full bg-gray-200 h-4 overflow-hidden flex items-center">
            {Object.keys(variantCount).map((variant, index) => (
              <div
                key={index}
                className="h-full"
                style={{
                  width: `${(variantCount[variant] / data.length) * 100}%`, 
                  backgroundColor: ["#1E3A8A", "#34D399", "#10B981", "#A78BFA", "#F87171"][index % 5],
                }}
              ></div>
            ))}
          </div>

          <div className="flex justify-between mt-3">
            {Object.keys(variantCount).map((variant, index) => (
              <div key={index} className="text-center">
                <p className="text-gray-800 text-sm">{variant}</p>
                <p className="text-gray-500 text-xs">{((variantCount[variant] / data.length) * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>


        <div className=" border rounded-xl bg-white p-5">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Total Available Stock
          </h2>
          <Pie data={pieData} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="border rounded-xl bg-white p-5">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-medium text-gray-800">Stock</h2>
            <a href="#" className="text-bg-color font-medium text-sm">
              See All Products &gt;
            </a>
          </div>
          <div className="space-y-3">
            {products.map((product, i) => {
              const stockPercentage =
                product.originalStock > 0
                  ? (product.stock / product.originalStock) * 100
                  : 0;

              return (
                <div
                  key={product.id}
                  className="flex flex-col gap-[22px] justify-between items-center"
                >
                  <div className="flex items-center w-full justify-between">
                    <p className="text-gray-600">{product.combination}</p>
                    <p className="text-gray-500 text-sm ml-2">
                      {stockPercentage.toFixed(2)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${stockPercentage}%`,
                        backgroundColor: ["#1E3A8A", "#FBBF24", "#34D399", "#F87171", "#A78BFA", "#F87171", "#A78BFA"][i % 7],
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHero;
