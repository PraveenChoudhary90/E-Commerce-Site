import { NumericFormat } from "react-number-format";

const HeaderStats = (data) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.data?.map((stat, index) => (
                <div
                    key={index}
                    className="px-4 py-3 bg-white rounded-xl flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h4 className="text-sm text-[#a0aec0] font-semibold">
                            {stat.title}
                        </h4>
                        <h3 className="text-xl font-semibold flex gap-1 items-end">
                            {stat.symbol}
                            <NumericFormat
                                value={stat.value}
                                allowLeadingZeros
                                thousandSeparator=","
                                displayType="text"
                            />
                            <span
                                className={`text-xs font-light ${
                                    stat.status === "up"
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            >
                                {stat.change}
                            </span>
                        </h3>
                    </div>
                    <div>
                        <div
                            className={`w-10 flex items-center justify-center text-xl h-10 rounded-xl bg-bg-color`}
                        >
                            <p className={`text-white`}>{stat.icon}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeaderStats;
