import { axiosInstance } from "./axiosInstance";
import { endpoints } from "./endpoints";
import type { ProductListType } from "../types/type";

export const getProductList = async():Promise<ProductListType[]>=>{
    const response = await axiosInstance.get(endpoints.products.listItems);
    return response?.data.products;
}