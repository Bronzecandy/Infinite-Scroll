import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

export const fetchProducts = async (skip: number, limit: number) => {
  const response = await axios.get(`${API_BASE_URL}/products?skip=${skip}&limit=${limit}`);
  return response.data.products;
};

export const searchProducts = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/products/search?q=${query}`);
  return response.data.products;
};
