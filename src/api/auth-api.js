import { Axios } from "../constants/mainContent";


export async function loginWithEmailAdmin(payload) {
  const response = await Axios.post("/auth/login", payload);
  return response?.data;
const apiUrl = "/admin";

export async function loginWithEmailAdmin(payload) {
    const response = await Axios.post(`${apiUrl}/login`, payload);
    return response.data;

}

export async function getAdminInfo() {
  const response = await Axios.get(`${apiUrl}/get-admin`);
  return response?.data;
}


export async function getDashboardDetails() {
  const response = await Axios.get(`${apiUrl}/get-dashboard-data`);
  return response?.data;
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
  const response = await Axios.get(`${apiUrl}/get-seller-list-to-verify`);
  return response?.data;
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
  const response = await Axios.put(`${apiUrl}/create-coupon/${id}`,data);
  return response?.data;
}

export async function deleteCoupon(id) {
  const response = await Axios.delete(`${apiUrl}/delete-coupon/${id}`);
  return response?.data;
}

export async function updateVendorStatus(id, status, reason = "") {
  const response = await Axios.put(`${apiUrl}/update-vendor-status/${id}/${status}`, { reason } );
  return response?.data;
} 

export async function switchVendorToPromoter(id) {
  const response = await Axios.put(`${apiUrl}/switch-vendor-to-promoter/${id}`);
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