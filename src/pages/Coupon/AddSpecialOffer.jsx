import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { rewardManagement } from "../../api/auth-api";
import Button from "../../components/Button";
import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";
import SpecialOffer from "./SpecialOffer";

const AddSpecialOffer = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [coupons, setCoupons] = useState([]);

    const onSubmit = async (data) => {
        data.purchaseAmount = Number(data.purchaseAmount);
        data.offer = Number(data.offer);
        data.rewardType = "specialOffer";
        setLoading(true);

        try {
            const response = await rewardManagement(data);
            Swal.fire({
                icon: "success",
                title: "Special Offer Added!",
                text: "Special Offer Created Successfully",
            });

            reset();
            setShowCouponForm(false);
            setCoupons(response.data);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error in creating special offer!",
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
                    <h2 className="md:text-xl text-lg font-medium text-center">
                        Available Special Offers
                    </h2>
                    <Button className="py-3" title="Create new Special Offers" onClick={() => setShowCouponForm(!showCouponForm)} />
                </div>
                    {showCouponForm && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="md:w-1/2 mx-auto p-5 bg-white shadow-lg rounded-lg ">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-bold mb-4 text-center ">Create Special Offers</h2>
                                    <button className="text-4xl text-red-400" onClick={() => setShowCouponForm(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block font-medium">Purchase Amount</label>
                                        <input
                                            type="text"
                                            {...register("purchaseAmount", { required: "Purchase Amount is required" })}
                                            className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                                            placeholder="Enter Purchase Amount"
                                        />
                                        {errors.purchaseAmount && <p className="text-red-500 text-sm">{errors.purchaseAmount?.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block font-medium">Offer</label>
                                        <input
                                            type="number"
                                            {...register("offer", {
                                                required: "Offer is required",
                                                min: { value: 1, message: "Must be at least 1%" },
                                                max: { value: 100, message: "Cannot exceed 100%" }
                                            })}
                                            className="w-full border p-2 rounded-md focus:ring-1 focus:ring-blue-300 outline-none"
                                            placeholder="Enter Offer Amount"
                                        />
                                        {errors.offer && <p className="text-red-500 text-sm">{errors.offer.message}</p>}
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
                                    <button
                                        type="submit"
                                        className="w-full bg-bg-color text-white py-2 rounded-md transition"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Special Offer"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    <SpecialOffer coupons={coupons} />
                <Footer1 />
            </div>
        </>
    );
};

export default AddSpecialOffer