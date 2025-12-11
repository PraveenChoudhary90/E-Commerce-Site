import React, { useEffect, useState } from "react";
import { fetchRewards } from "../../api/auth-api";
import Button from "../../components/Button";
import PageLoader from "../../components/ui/PageLoader";
import { all } from "axios";

const SpecialOffer = () => {
  const [couponData, setCouponData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCoupons = async () => {
      try {
        setLoading(true);
        const allCoupons = await fetchRewards();
        // setReferralRewards(data.filter(reward => reward.rewardType === "referral"));
        const data = allCoupons?.data.filter(reward => reward.rewardType === "specialReward")
        setCouponData(data);
        console.log(data, "allCoupons");
        
      } catch (err) {
        setError("Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    };
    getCoupons();
  }, []);

  return (
    <div className="">
     {loading && <PageLoader />}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {couponData.length > 0 ? (
            
            couponData.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-lg p-4 relative border-l-4 border-bg-color shadow-md">
                <h3 className="text-xl font-semibold">{coupon.franchiseReward?.purchaseAmount}</h3>
                
                <p className="text-gray-600 text-sm">
                  Get <span className="font-bold text-green-600">{coupon.franchiseReward?.offer}</span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Valid from: <span className="font-semibold">{new Date(coupon.franchiseReward?.validFrom).toLocaleDateString()}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Valid till: <span className="font-semibold">{new Date(coupon.franchiseReward?.validTill).toLocaleDateString()}</span>
                </p>
                
              </div>
            ))
          ) : (
            <p className="text-gray-600">No coupons available.</p>
          )}
        </div>
      )}
    </div>
  );
};


export default SpecialOffer