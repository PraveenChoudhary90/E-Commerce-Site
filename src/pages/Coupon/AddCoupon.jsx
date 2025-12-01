import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { addCoupon } from "../../api/auth-api";
import Coupon from "./Coupon";
import Button from "../../components/Button";
import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";

const AddCoupon = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [coupons, setCoupons] = useState([]); // Coupons state manage karne ke liye

  const onSubmit = async (data) => {
    data.maxUsagePerUser = Number(data.maxUsagePerUser);
    setLoading(true);
    try {
      const response = await addCoupon(data);
      Swal.fire({
        icon: "success",
        title: "Coupon is Added!",
        text: "Coupon Added Successfully",
      }).then(()=>{
        window.location.reload()
      })

      reset();
      setShowCouponForm(false);
      setCoupons((prevCoupons) => [...prevCoupons, response.data]);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error in creating coupons!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="flex flex-col gap-5">
        
        <div className="flex justify-between gap-2 flex-wrap items-center">
          <h2 className=" md:text-xl text-lg font-medium text-center">
            Available Coupons
          </h2>
          <Button className="py-3" title="Create new coupon" onClick={() => setShowCouponForm(!showCouponForm)} />
        </div>
        
          {showCouponForm && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="md:w-1/2 mx-auto p-5 bg-white shadow-lg rounded-lg ">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold mb-4 text-center ">Create Coupon</h2>
                  <button className="text-4xl text-red-400" onClick={() => setShowCouponForm(false)}>&times;</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block font-medium">Scheme Name</label>
                    <input
                      type="text"
                      {...register("schemeName", { required: "Scheme name is required" })}
                      className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                      placeholder="Enter scheme name"
                    />
                    {errors.schemeName && <p className="text-red-500 text-sm">{errors.schemeName.message}</p>}
                  </div>
                  <div>
                    <label className="block font-medium">Coupon Code</label>
                    <input
                      type="text"
                      {...register("couponCode", { required: "Coupon code is required" })}
                      className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                      placeholder="Enter coupon code"
                    />
                    {errors.couponCode && <p className="text-red-500 text-sm">{errors.couponCode.message}</p>}
                  </div>

                  <div>
                    <label className="block font-medium">Discount (%)</label>
                    <input
                      type="number"
                      {...register("discount", {
                        required: "Discount is required",
                        min: { value: 1, message: "Must be at least 1%" },
                        max: { value: 100, message: "Cannot exceed 100%" }
                      })}
                      className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                      placeholder="Enter discount percentage"
                    />
                    {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
                  </div>

                  <div>
                    <label className="block font-medium">Valid From</label>
                    <input
                      type="date"
                      {...register("validFrom", { required: "Start date is required" })}
                      className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                    />
                    {errors.validFrom && <p className="text-red-500 text-sm">{errors.validFrom.message}</p>}
                  </div>

                  <div>
                    <label className="block font-medium">Valid Till</label>
                    <input
                      type="date"
                      {...register("validTill", { required: "End date is required" })}
                      className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                    />
                    {errors.validTill && <p className="text-red-500 text-sm">{errors.validTill.message}</p>}
                  </div>

                  {/* <div>
                  <label className="block font-medium">Max. Usage Per User</label>
                  <input
                    type="number"
                    {...register("maxUsagePerUser", { required: "Max. usage per user is required" })}
                    className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                  />
                  {errors.maxUsagePerUser && <p className="text-red-500 text-sm">{errors.maxUsagePerUser.message}</p>}
                </div> */}
                  <button
                    type="submit"
                    className="w-full bg-bg-color text-white py-2 rounded-md hover:bg-violet-700 transition"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Coupon"}
                  </button>
                </form>
              </div>
            </div>
          )}
          <Coupon coupons={coupons} />
  
        <Footer1 />
      </div>
    </>
  );
};

export default AddCoupon;
