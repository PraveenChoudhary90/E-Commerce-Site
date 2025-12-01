import { Axios } from "../constants/mainContent";

const apiUrl = "/seller";

export async function getSellerById(id) {
    const response = await Axios.get(`${apiUrl}/get-seller-details/${id}`);
    return response?.data;
}