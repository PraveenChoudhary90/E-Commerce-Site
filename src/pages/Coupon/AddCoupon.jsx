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
  const [coupons, setCoupons] = useState([]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await addCoupon(data);
      Swal.fire({ icon: "success", title: "Coupon Added!", text: "Coupon added successfully" });

      reset();
      setShowCouponForm(false);
      setCoupons(prev => [...prev, response.data]); // Turant UI update
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to create coupon!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between gap-2 flex-wrap items-center">
          <h2 className="md:text-xl text-lg font-medium text-center">Available Coupons</h2>
          <Button title="Create new coupon" onClick={() => setShowCouponForm(!showCouponForm)} className="py-3 bg-[#085946] !text-white hover:bg-[#064f3d]" />
        </div>

        {showCouponForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="md:w-1/2 mx-auto p-5 bg-white shadow-lg rounded-lg">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-4 text-center">Create Coupon</h2>
                <button className="text-4xl text-red-400" onClick={() => setShowCouponForm(false)}>&times;</button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label>Scheme Name</label>
                  <input type="text" {...register("schemeName", { required: true })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" placeholder="Enter scheme name" />
                  {errors.schemeName && <p className="text-red-500 text-sm">Scheme name is required</p>}
                </div>

                <div>
                  <label>Coupon Code</label>
                  <input type="text" {...register("couponCode", { required: true })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" placeholder="Enter coupon code" />
                </div>

                <div>
                  <label>Discount (%)</label>
                  <input type="number" {...register("discount", { required: true, min: 1, max: 100 })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" placeholder="Enter discount %" />
                </div>

                <div>
                  <label>Valid From</label>
                  <input type="date" {...register("validFrom", { required: true })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" />
                </div>

                <div>
                  <label>Valid Till</label>
                  <input type="date" {...register("validTill", { required: true })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" />
                </div>

                <button type="submit" className="w-full bg-bg-color text-white py-2 rounded-md hover:bg-violet-700 transition">
                  {loading ? "Creating..." : "Create Coupon"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Coupon list */}
        <Coupon coupons={coupons} setCoupons={setCoupons} />

        <Footer1 />
      </div>
    </>
  );
};

export default AddCoupon;
