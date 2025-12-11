import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InputField from "../../components/InputField";
import { fetchRewards, rewardManagement } from "../../api/auth-api";


const tabs = ["Referral Reward", "Repeated Purchase Discount", "Special Reward"];

// API call functions

export default function RewardManagementForm() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State for storing fetched rewards
  const [referralRewards, setReferralRewards] = useState([]);
  const [repetitivePurchaseRewards, setRepetitivePurchaseRewards] = useState([]);
  const [specialRewards, setSpecialRewards] = useState([]);
  const [fetchingRewards, setFetchingRewards] = useState(false);

  const [ReferralFormData, setReferralFormData] = useState({
    rewardType: "referral",
    minPurchaseAmount: "",
    commissionPercentage: ""
  });
  const [RepetitivePurchaseFormData, setRepetitivePurchaseFormData] = useState({
    rewardType: "repetitivePurchase",
    discountPercentage: "",
    minPurchaseAmount: "",
  });
  const [SpecialRewardFormData, setSpecialRewardFormData] = useState({
    rewardType: "specialReward",
    rewardName: "",
    monthsRequired: "",
    minPurchaseAmount: "",
  });

  // Fetch rewards when component mounts
  useEffect(() => {
    loadRewards();
  }, []);

  // Function to load rewards from API
  const loadRewards = async () => {
    setFetchingRewards(true);
    try {
      const data = await fetchRewards();


      // Filter rewards by type
      setReferralRewards(data?.data.filter(reward => reward.rewardType === "referral"));
      setRepetitivePurchaseRewards(data?.data.filter(reward => reward.rewardType === "repetitivePurchase"));
      setSpecialRewards(data?.data.filter(reward => reward.rewardType === "specialReward"));
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to load rewards. Please try again.");
    } finally {
      setFetchingRewards(false);
    }
  };

  // Handlers for each form type
  const handleReferralChange = (e) => {
    const { name, value } = e.target;
    setReferralFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRepetitivePurchaseChange = (e) => {
    const { name, value } = e.target;
    setRepetitivePurchaseFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialRewardChange = (e) => {
    const { name, value } = e.target;
    setSpecialRewardFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset status messages
  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  // Submit handlers for each form
  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    resetStatus();
    setLoading(true);

    try {
      const result = await rewardManagement(ReferralFormData);
      console.log("Submitted Referral Data:", result);
      setSuccess(true);
      // Reset form
      setReferralFormData({ rewardType: "referral", minPurchaseAmount: "", commissionPercentage: "" });
      // Reload rewards to show the new one
      await loadRewards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create referral reward");
      console.error("Error submitting referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepetitivePurchaseSubmit = async (e) => {
    e.preventDefault();
    resetStatus();
    setLoading(true);

    try {
      const result = await rewardManagement(RepetitivePurchaseFormData);
      console.log("Submitted Repetitive Purchase Data:", result);
      setSuccess(true);
      // Reset form
      setRepetitivePurchaseFormData({ rewardType: "repetitivePurchase", discountPercentage: "", minPurchaseAmount: "" });
      // Reload rewards to show the new one
      await loadRewards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create purchase discount");
      console.error("Error submitting repetitive purchase data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialSubmit = async (e) => {
    e.preventDefault();
    resetStatus();
    setLoading(true);

    try {
      const result = await rewardManagement(SpecialRewardFormData);
      console.log("Submitted Special Reward Data:", result);
      setSuccess(true);
      // Reset form
      setSpecialRewardFormData({ rewardType: "specialReward", rewardName: "", monthsRequired: "", minPurchaseAmount: "" });
      // Reload rewards to show the new one
      await loadRewards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create special reward");
      console.error("Error submitting special reward data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render a table for referral rewards
  const renderReferralTable = () => {
    if (fetchingRewards) return <p className="text-center py-4">Loading rewards...</p>;
    if (referralRewards.length === 0) return <p className="text-center py-4 text-gray-500">No referral rewards found.</p>;

    return (
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Current Referral Rewards</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referralRewards.map((reward, index) => (
                <tr key={reward.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.referral?.minPurchaseAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.referral?.commissionPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(reward.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRepetitivePurchaseTable = () => {
    if (fetchingRewards) return <p className="text-center py-4">Loading rewards...</p>;
    if (repetitivePurchaseRewards.length === 0) return <p className="text-center py-4 text-gray-500">No repeated purchase discounts found.</p>;

    return (
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Current Repeated Purchase Discounts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency (Months)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repetitivePurchaseRewards.map((reward, index) => (
                <tr key={reward.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.repetitivePurchase?.months}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.repetitivePurchase?.discountPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(reward.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render a table for special rewards
  const renderSpecialRewardTable = () => {
    if (fetchingRewards) return <p className="text-center py-4">Loading rewards...</p>;
    if (specialRewards.length === 0) return <p className="text-center py-4 text-gray-500">No special rewards found.</p>;

    return (
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Current Special Rewards</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Months Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {specialRewards.map((reward, index) => (
                <tr key={reward.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.specialReward?.rewardName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.specialReward?.minPurchaseAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reward?.specialReward?.monthsRequired}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(reward.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 bg-[#702F8A12] flex flex-col rounded-xl space-y-5">
      <h1 className="lg:text-xl md:text-lg text-sm font-medium">
        Reward Management
      </h1>

      <div className="flex border-b bg-bg-color1 p-4 rounded-lg w-full whitespace-nowrap overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTab(index);
              resetStatus();
            }}
            className={`relative flex-1 p-3 px-8 text-center font-medium md:text-sm text-xs transition duration-300 ${activeTab === index ? "text-white" : "text-gray-700"
              }`}
          >
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#702F8A] rounded-lg z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* Status messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Reward created successfully!
        </div>
      )}

      <div className="bg-bg-color1 p-6 rounded-lg w-full">
        {activeTab === 0 && (
          <motion.div
            key="referral-reward"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold mb-4">Referral Reward</h2>
            <form onSubmit={handleReferralSubmit} className="space-y-4">
              <InputField
                label="Minimum purchase Amount"
                name="minPurchaseAmount"
                value={ReferralFormData.minPurchaseAmount}
                onChange={handleReferralChange}
                placeholder="Enter minimum purchase amount"
              />
              <InputField
                label="Reward Percentage"
                name="commissionPercentage"
                value={ReferralFormData.commissionPercentage}
                onChange={handleReferralChange}
                placeholder="Enter commission percentage"
                type="number"
              />
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 bg-[#702F8A] text-white px-4 py-2 rounded-lg w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>

            {/* Referral Rewards Table */}
            {renderReferralTable()}
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            key="discount-reward"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold mb-4">Repeated Purchase Discount</h2>
            <form onSubmit={handleRepetitivePurchaseSubmit} className="space-y-4">
              <InputField
                label="Minimum purchase Amount"
                name="minPurchaseAmount"
                value={RepetitivePurchaseFormData.minPurchaseAmount}
                onChange={handleRepetitivePurchaseChange}
                placeholder="Enter minimum purchase amount"
              />
              <InputField
                label="Discount Percentage"
                name="discountPercentage"
                value={RepetitivePurchaseFormData.discountPercentage}
                onChange={handleRepetitivePurchaseChange}
                placeholder="Enter discount percentage"
                type="number"
              />
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 bg-[#702F8A] text-white px-4 py-2 rounded-lg w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>

            {/* Repetitive Purchase Rewards Table */}
            {renderRepetitivePurchaseTable()}
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            key="special-reward"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold mb-4">Special Reward</h2>
            <form onSubmit={handleSpecialSubmit} className="space-y-4">
              <InputField
                label="Minimum Purchase Amount"
                name="minPurchaseAmount"
                value={SpecialRewardFormData.minPurchaseAmount}
                onChange={handleSpecialRewardChange}
                placeholder="Enter minimum purchase amount"
              />
              <InputField
                label="Time Period"
                name="monthsRequired"
                value={SpecialRewardFormData.monthsRequired}
                onChange={handleSpecialRewardChange}
                placeholder="Enter number of months required"
              />
              <InputField
                label="Special Reward Value"
                name="rewardName"
                value={SpecialRewardFormData.rewardName}
                onChange={handleSpecialRewardChange}
                placeholder="Enter reward name"
              />
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 bg-[#702F8A] text-white px-4 py-2 rounded-lg w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>

            {/* Special Rewards Table */}
            {renderSpecialRewardTable()}
          </motion.div>
        )}
      </div>
    </div>
  );
}