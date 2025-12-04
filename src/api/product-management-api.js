import { Axios } from "../constants/mainContent.js";


const apiUrl = "/products";
export async function addCategory(payload) {
  const response = await Axios.post(`${apiUrl}/create-category`, payload);
  return response?.data;
}
export async function addCategoryType(payload) {
  const response = await Axios.post(`${apiUrl}/create-type`, payload);
  return response?.data;
}

export async function editCategoryType(payload, id) {
  const response = await Axios.post(`${apiUrl}/create-category/${id}`, payload);
  return response?.data;
}


export async function deleteCategoryType(id) {
  const response = await Axios.delete(`${apiUrl}/delete-category/${id}`);
  return response?.data;
}

export async function deleteVariant(id) {
  const response = await Axios.delete(`${apiUrl}/delete-variant/${id}`);
  return response?.data;
}



export async function addCategoryBrand(payload) {
  const response = await Axios.post(`${apiUrl}/create-brand`, payload);
  return response?.data;
}

export async function getAllProductList() {
  const response = await Axios.get(`${apiUrl}/get-products`);
  return response?.data;
}

export async function getAllBannerList() {
  const response = await Axios.get(`${apiUrl}/get-banners`);
  return response?.data;
}

export async function addBanner(payload) {
  const response = await Axios.post(`${apiUrl}/create-banner`, payload);
  return response?.data;
}

export async function getDetails() {
  const response = await Axios.get(`${apiUrl}/get-details`);
  return response?.data;
}

export async function getCategoryList() {
  const response = await Axios.get(`${apiUrl}/get-categories`);
  return response?.data;
}

// export async function getBrandsList() {
//   const response = await Axios.get(`${apiUrl}/get-brands`);
//   return response?.data;
// }

export async function addProductType(payload) {
  const response = await Axios.post(`${apiUrl}/create-type`, payload);
  return response?.data;
}

// export async function getProductTypeList() {
//   const response = await Axios.get(`${apiUrl}/get-types`);
//   return response?.data;
// }


export async function getBrandWithTypes(types) {
  console.log(types, "pallavi")
  const response = await Axios.get(`${apiUrl}/get-brands-with-types/${types}`);
  return response?.data;
}

export async function addNewBrand(payload) {
  const response = await Axios.post(`${apiUrl}/create-brand`, payload);
  return response?.data;
}

export async function addProductForm(payload) {
  const response = await Axios.post(`${apiUrl}/create-product`, payload);
  return response?.data;
}

export async function addVariant(payload) {
  const response = await Axios.post(`${apiUrl}/create-variant`, payload);
  return response?.data;
}

export async function editVariant(id, payload) {
  const response = await Axios.post(`${apiUrl}/create-variant/${id}`, payload);
  return response?.data;
}

export async function getVariantsList() {
  const response = await Axios.get(`${apiUrl}/get-variants`);
  return response?.data;
}

export async function updateBanner(id, data) {
  const response = await Axios.put(`${apiUrl}/update-banner/${id}`, data);
  return response?.data;
}

export async function deleteBanner(id) {
  const response = await Axios.delete(`${apiUrl}/delete-banner/${id}`);
  return response?.data;
}

export async function deleteProduct(id) {
  const response = await Axios.delete(`${apiUrl}/delete-product/${id}`);
  return response?.data;
}

export async function updateProduct(id, data) {
  const response = await Axios.put(`${apiUrl}/update-product/${id}`, data);
  return response?.data;
}

export async function filterProducts(year, month, date) {
  const queryParams = new URLSearchParams();

  if (year) queryParams.append("year", year);
  if (month) queryParams.append("month", month);
  if (date) queryParams.append("date", date);

  const queryString = queryParams.toString();
  const url = `${apiUrl}/filter-products${queryString ? `?${queryString}` : ""}`;

  const response = await Axios.get(url);
  return response?.data;
}

export async function createStaticBanner(payload) {
  const response = await Axios.post(`${apiUrl}/create-static-banner`, payload);
  return response?.data;
}

export async function updateStaticBanner(payload, id) {
  console.log(id)
  const response = await Axios.post(`${apiUrl}/create-static-banner/${id}`, payload);
  return response?.data;
}

export async function getStaticBanner() {
  const response = await Axios.get(`/products/get-static-banners`);
  return response?.data;
}

export async function deleteStaticBanner(id) {
  const response = await Axios.delete(`${apiUrl}/delete-static-banner/${id}`);
  return response?.data;
}


export async function softHideProduct(id) {
  const response = await Axios.put(`${apiUrl}/soft-hide-product/${id}`);
  return response?.data;
}