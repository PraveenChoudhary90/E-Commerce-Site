import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchRewards, deleteReward, updateReward } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";

const SpecialOffer = ({ coupons = [], setCoupons }) => {
  const [offers, setOffers] = useState(coupons);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync local state with parent coupons prop
  useEffect(() => {
    setOffers(coupons);
  }, [coupons]);

  // Fetch offers if no coupons passed
  useEffect(() => {
    if (!coupons || coupons.length === 0) {
      getOffers();
    } else {
      setLoading(false);
    }
  }, []);

  const getOffers = async () => {
    try {
      setLoading(true);
      const res = await fetchRewards();
      const data = res?.data ?? [];
      const specialOffers = data.filter((item) => item.rewardType === "specialOffer");
      setOffers(specialOffers);
      if (setCoupons) setCoupons(specialOffers);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch special offers");
    } finally {
      setLoading(false);
    }
  };

  // DELETE with SweetAlert2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This offer will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteReward(id);
        const updated = offers.filter((item) => item._id !== id);
        setOffers(updated);
        if (setCoupons) setCoupons(updated);
        Swal.fire("Deleted!", "The offer has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete the offer.", "error");
      }
    }
  };

  // UPDATE with SweetAlert2 full form
  const handleUpdate = async (offer) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Special Offer",
      html:
        `<input id="purchaseAmount" type="number" class="swal2-input" placeholder="Purchase Amount" value="${offer.purchaseAmount}">` +
        `<input id="offer" type="number" class="swal2-input" placeholder="Offer (%)" value="${offer.offer}">` +
        `<input id="validFrom" type="date" class="swal2-input" value="${offer.validFrom.split("T")[0]}">` +
        `<input id="validTill" type="date" class="swal2-input" value="${offer.validTill.split("T")[0]}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",       // ✅ OK button text
  cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          purchaseAmount: Number(document.getElementById("purchaseAmount").value),
          offer: Number(document.getElementById("offer").value),
          validFrom: document.getElementById("validFrom").value,
          validTill: document.getElementById("validTill").value,
        };
      },
    });

    if (formValues) {
      try {
        const updatedPayload = { ...offer, ...formValues };
        const res = await updateReward(offer._id, updatedPayload);
        const updated = offers.map((item) => (item._id === offer._id ? res.data : item));
        setOffers(updated);
        if (setCoupons) setCoupons(updated);
        Swal.fire("Updated!", "The offer has been updated.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to update the offer.", "error");
      }
    }
  };

  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(dateStr)
    );

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-md"
            >
              <h3 className="text-xl font-semibold">
                Purchase Amount: ₹{offer.purchaseAmount}
              </h3>

              <p className="text-gray-600 text-sm">
                Offer: <span className="font-bold text-green-600">{offer.offer}%</span>
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Valid from: <span className="font-semibold">{formatDate(offer.validFrom)}</span>
              </p>

              <p className="text-gray-500 text-sm">
                Valid till: <span className="font-semibold">{formatDate(offer.validTill)}</span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleUpdate(offer)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(offer._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No special offers available.</p>
      )}
    </div>
  );
};

export default SpecialOffer;
