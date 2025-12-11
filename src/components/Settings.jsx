import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GetMarketingPlan, updateMarketingPlan } from "../api/auth-api";

export default function SettingsForm() {
    const [form, setForm] = useState({
        minWithdrawal: '',
        cashbackPercent: '',
        cashbackExpiry: '',
        repurchaseDays: '',
        tds: '',
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const getMarketingPlan = async () => {
        try {
            const response = await GetMarketingPlan();
            if (response) {
                setForm({
                    minWithdrawal: response.minWithdrawal,
                    cashbackPercent: response.cashbackPercent,
                    cashbackExpiry: response.cashbackExpiry,
                    repurchaseDays: response.repurchaseDays,
                    tds: response.tds,
                });
            }
        } catch (error) {
            console.error("Error fetching marketing plan:", error);
        }
    }

    useEffect(() => {
        getMarketingPlan();
    }, [])

    const handleSubmit = async () => {
        console.log("Form submitted:", form);
        try {
            const response = await updateMarketingPlan(form)
            Swal.fire({
                icon: "success",
                title: "Settings Saved",
                text: "Your settings have been saved successfully.",
            }).then(() => {
                getMarketingPlan()
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save settings. Please try again.",
            });
            return;
        }
        alert("Settings saved successfully!");
    };


    return (
        <div className="h-full w-full md:w-1/2 bg-purple-50 rounded-xl shadow-lg flex flex-col items-center justify-center p-4">
            <div className="flex flex-col gap-6 w-full">
                {/* Min Withdrawal */}
                <div className="w-full border border-purple-300 rounded-3xl p-4 text-center bg-white shadow-sm">
                    <h3 className="text-purple-700 font-bold underline mb-2">
                        MINIMUM WITHDRAWAL AMOUNT
                    </h3>
                    <input
                        type="number"
                        value={form.minWithdrawal}
                        onChange={(e) => handleChange("minWithdrawal", Number(e.target.value))}
                        className="w-24 text-center font-semibold border rounded p-2"
                    />
                </div>

                {/* Cashback */}
                <div className="border border-purple-300 rounded-3xl p-4 text-center bg-white shadow-sm">
                    <h3 className="text-purple-700 font-bold underline mb-4">
                        CASH BACK
                    </h3>
                    <div className="flex justify-around items-center gap-2">
                        <div className="flex flex-col items-center">
                            <span className="text-purple-700 underline font-semibold text-sm mb-1">
                                PERCENTAGE %
                            </span>
                            <input
                                type="number"
                                value={form.cashbackPercent}
                                onChange={(e) => handleChange("cashbackPercent", Number(e.target.value))}
                                className="w-16 text-center font-semibold border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-purple-700 underline font-semibold text-sm mb-1">
                                EXPIRY DAYS
                            </span>
                            <input
                                type="number"
                                value={form.cashbackExpiry}
                                onChange={(e) => handleChange("cashbackExpiry", Number(e.target.value))}
                                className="w-16 text-center font-semibold border rounded p-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Repurchase + TDS */}
                <div className="flex gap-4">
                    <div className="flex-1 border border-purple-300 rounded-3xl p-4 text-center bg-white shadow-sm">
                        <h3 className="text-purple-700 font-bold underline mb-2">
                            RE-PURCHASE DAYS
                        </h3>
                        <input
                            type="number"
                            value={form.repurchaseDays}
                            onChange={(e) => handleChange("repurchaseDays", Number(e.target.value))}
                            className="w-16 text-center font-semibold border rounded p-2"
                        />
                    </div>
                    <div className="flex-1 border border-purple-300 rounded-3xl p-4 text-center bg-white shadow-sm">
                        <h3 className="text-purple-700 font-bold underline mb-2">
                            TDS %
                        </h3>
                        <input
                            type="number"
                            value={form.tds}
                            onChange={(e) => handleChange("tds", Number(e.target.value))}
                            className="w-16 text-center font-semibold border rounded p-2"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <button
  type="submit"
  onClick={handleSubmit}
  className="bg-purple-700 text-white font-bold rounded-lg px-6 py-2 shadow hover:bg-purple-800"
>
  SAVE
</button>

            </div>
        </div>
    );
}