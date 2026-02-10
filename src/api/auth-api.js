import { Axios } from "../constants/mainContent";

const apiUrl = "/admin";


export async function loginWithEmailAdmin(payload) {
  const response = await Axios.post("/admin/login", payload);
  return response?.data;
}

// export async function loginWithEmailAdmin(payload) {
//     const response = await Axios.post(`${apiUrl}/login`, payload);
//     return response.data;

// }

export async function getAdminInfo() {
  const response = await Axios.get(`${apiUrl}/get-admin`);
  return response?.data;
}


export async function getDashboardDetails() {
  const response = await Axios.get(`${apiUrl}/get-dashboard-data`);
  return response?.data;
}






export async function getOrderDetails() {
  const response = await Axios.get(`${apiUrl}/get-order-details`);
  return response?.data;
}



export async function cancelOrderByAdmin(orderId,newStatus){
  const payload={newStatus}
  const response =await Axios.put(`${apiUrl}/orders/status-update/${orderId}`,{ payload,
     headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //  Token yahin send ho raha hai
      },
  })
  return response.data;
};





export const getIncomeOrdersByAdmin = async () => {
  const res = await Axios.get(`${apiUrl}/income/AdminallIncomeorder`);
  return res.data;
};





export async function getCategories() {
  const response = await Axios.get("/products/get-product-details");
  return response?.data;
}

// 🔹 UPDATE PRODUCT
export async function updateItem(id, data) {
  try {
    const response = await Axios.put(`products/update-product/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// 🔹 DELETE PRODUCT
export async function deleteItem(id) {
  try {
    const response = await Axios.delete(`products/delete-product/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}



export async function CreateMember(payload) {
  const response = await Axios.post(`${apiUrl}/create-member`, payload);
  return response?.data;
}

export async function getMembers() {
  const response = await Axios.get(`${apiUrl}/get-members`);
  return response?.data;
}

export async function getMemberById(id) {
  const response = await Axios.get(`${apiUrl}/get-member/${id}`);
  return response?.data;
}

export async function updateMember(id, data) {
  const response = await Axios.put(`${apiUrl}/update-member/${id}`, data);
  return response?.data;
}
export async function deleteMember(id) {
  const response = await Axios.delete(`${apiUrl}/delete-member/${id}`);
  return response?.data;
}

export async function getSellerListToVerify() {
  const response = await Axios.get(`${apiUrl}/get-all-user`);
  return response?.data;
}


export async function toggleVendorBlockStatus(vendorId, isBlocked) {
  const response = await Axios.put(`${apiUrl}/auth/vendorblock/${vendorId}`, {
    isBlocked,
  });
  return response?.data; // return updated vendor info
}





export async function getSellerById(id) {
  const response = await Axios.get(`${apiUrl}/get-seller-by-id/${id}`);
  return response?.data;
}

export async function addCoupon(payload) {
  const response = await Axios.post(`${apiUrl}/create-coupon`, payload);
  return response?.data;
}

export async function getAllValidCoupons() {
  const response = await Axios.get(`${apiUrl}/get-coupons`);
  return response?.data;
}
export async function updateCoupon(id , data) {
  const response = await Axios.put(`${apiUrl}/update-coupon/${id}`,data);
  return response?.data;
}

export async function deleteCoupon(id) {
  const response = await Axios.delete(`${apiUrl}/delete-coupon/${id}`);
  return response?.data;
}

// export async function updateVendorStatus(id, status, reason = "") {
//   const response = await Axios.put('/auth/update-vendor-status/${id}/${status}', { reason } );
//   return response?.data;
// } 
export async function updateVendorStatus(id, status, reason = "") {
  const response = await Axios.put(
    `/auth/update-vendor-status/${id}/${status}`,
    { reason }
  );
  return response?.data;
}


// export async function switchVendorToPromoter(id) {
//   const response = await Axios.put(`switch-vendor-to-promoter/${id}`);
//   return response?.data;
// }
export async function switchVendorToPromoter(id) {
  const response = await Axios.put(`/auth/switch-vendor-to-promoter/${id}`);
  return response?.data;
}


export async function rewardManagement(payload) {
  const response = await Axios.post(`${apiUrl}/create-reward`, payload);
  return response?.data;
}

export async function fetchRewards() {
  const response = await Axios.get(`${apiUrl}/get-reward-list`);
  return response?.data;
}


// DELETE
export async function deleteReward(id) {
  const response = await Axios.delete(
    `${apiUrl}/delete-reward/${id}`
  );
  return response?.data;
}

// UPDATE
export async function updateReward(id, payload) {
  const response = await Axios.put(
    `${apiUrl}/update-reward/${id}`,
    payload
  );
  return response?.data;
}

export async function createPromotion(payload) {
  const response = await Axios.post(`${apiUrl}/create-promotion`, payload);
  return response?.data;
}

export async function fetchPromotion() {
  const response = await Axios.get(`${apiUrl}/get-promotions`);
  return response?.data;
}

export async function updatePromotion(payload , id) {
  const response = await Axios.put(`${apiUrl}/create-promotion/${id}`, payload);
  return response?.data;
}

export async function deletePromotion(id) {
  const response = await Axios.delete(`${apiUrl}/delete-promotion/${id}`);
  return response?.data;
}

export async function referralManagement(payload) {
  const response = await Axios.post(`${apiUrl}/update-referral-percentages`, {levelPercentages:payload});
  return response?.data;
}

export async function getReferralPercentages() {
  const response = await Axios.get(`${apiUrl}/get-referral-percentages`);
  return response?.data;
}

export async function getAllEnquiry() {
  const response = await Axios.get(`${apiUrl}/enquiries`);
  return response?.data;
}
export async function getAllSupports() {
  const response = await Axios.get(`${apiUrl}/support/admin`);
  console.log(response)
  return response?.data;
}
export async function closeSupport(id) {
  const res = await Axios.patch(`${apiUrl}/support/close/${id}`);
  return res?.data;
}



export async function replySupport(id, payload) {
  const response = await Axios.post(`${apiUrl}/support/reply/${id}`, payload);
  return response?.data;
}

export async function addEvent(payload) {
  const response = await Axios.post(`${apiUrl}/add-event`, payload);
  return response?.data;
}
export async function updateEvent(id, payload) {
  const response = await Axios.put(`${apiUrl}/update-event/${id}`, payload);
  return response?.data;
}
export async function deleteEvent(id) {
  const response = await Axios.delete(`${apiUrl}/delete-event/${id}`);
  return response?.data;
}
export async function getEventList() {
  const response = await Axios.get(`${apiUrl}/get-all-events`);
  return response?.data;
}

export async function updateMarketingPlan(payload) {
  const response = await Axios.post(`${apiUrl}/update-marketing-plan`, payload);
  return response?.data;
}
export async function GetMarketingPlan() {
  const response = await Axios.get(`${apiUrl}/get-marketing-plan`);
  return response?.data;
}