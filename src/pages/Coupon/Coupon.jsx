import React, { useEffect, useState } from "react";
import { deleteCoupon, getAllValidCoupons, updateCoupon } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Coupon = ({ coupons, setCoupons }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  // Initial fetch from API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await getAllValidCoupons();
        setCoupons(res.data || []);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
        setError("Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [setCoupons]);

  const handleEditClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponForm(true);

    setValue("schemeName", coupon.schemeName);
    setValue("couponCode", coupon.couponCode);
    setValue("discount", coupon.discount);
    if (coupon.validFrom) setValue("validFrom", coupon.validFrom.split("T")[0]);
    if (coupon.validTill) setValue("validTill", coupon.validTill.split("T")[0]);
  };

  const onSubmit = async (data) => {
    if (!selectedCoupon) return;

    try {
      setLoading(true);
      await updateCoupon(selectedCoupon._id, data);

      Swal.fire({
        icon: "success",
        title: "Coupon Updated",
        text: "The coupon has been successfully updated!",
        confirmButtonColor: "#6366F1",
      });

      setCoupons(prev =>
        prev.map(c => (c._id === selectedCoupon._id ? { ...c, ...data } : c))
      );

      setShowCouponForm(false);
      setSelectedCoupon(null);
      reset();
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update coupon. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteCoupon(id);
        setCoupons(prev => prev.filter(coupon => coupon._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Coupon has been deleted.",
          icon: "success",
          confirmButtonColor: "#6366F1",
        });
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Failed!",
          text: "Could not delete coupon. Please try again.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    });
  };

  return (
    <div>
      {loading && <PageLoader />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon._id} 
                className="bg-white rounded-lg p-4 relative border-l-4 border-bg-color shadow-md"
              >
                <div className="w-full flex items-center justify-between gap-2 py-2">
                  <div>
                    <h3 className="text-xl font-semibold">{coupon.schemeName}</h3>
                    <p className="text-xs text-gray-500">
                      Code: <span className="font-semibold">{coupon.couponCode}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 items-center justify-center text-sm">
                    <button
                      className="p-1 rounded text-bg-color bg-bg-color/10"
                      onClick={() => handleEditClick(coupon)}
                    >
                      <MdModeEdit />
                    </button>
                    <button
                      className="p-1 rounded text-bg-color bg-bg-color/10"
                      onClick={() => handleDeleteClick(coupon._id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">
                  Get <span className="font-bold text-green-600">{coupon.discount}% OFF</span>
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Valid from: <span className="font-semibold">{coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : "-"}</span>
                </p>

                <p className="text-gray-500 text-sm">
                  Valid till: <span className="font-semibold">{coupon.validTill ? new Date(coupon.validTill).toLocaleDateString() : "-"}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No coupons available.</p>
          )}
        </div>
      )}

      {showCouponForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="md:w-1/2 mx-auto p-5 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Coupon</h2>
              <button
                className="text-4xl text-red-400"
                onClick={() => {
                  setShowCouponForm(false);
                  setSelectedCoupon(null);
                  reset();
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium">Scheme Name</label>
                <input
                  type="text"
                  {...register("schemeName", { required: "Scheme name is required" })}
                  className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                />
                {errors.schemeName && <p className="text-red-500 text-sm">{errors.schemeName.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Coupon Code</label>
                <input
                  type="text"
                  {...register("couponCode", { required: "Coupon code is required" })}
                  className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                />
                {errors.couponCode && <p className="text-red-500 text-sm">{errors.couponCode.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Discount (%)</label>
                <input
                  type="number"
                  {...register("discount", { required: "Discount is required", min: 1, max: 100 })}
                  className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                />
                {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Valid From</label>
                <input type="date" {...register("validFrom", { required: true })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" />
              </div>

              <div>
                <label className="block font-medium">Valid Till</label>
                <input type="date" {...register("validTill", { required: true })} className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none" />
              </div>

              <button
                type="submit"
                className="w-full bg-bg-color text-white py-2 rounded-md hover:bg-violet-700 transition"
              >
                Update Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;
