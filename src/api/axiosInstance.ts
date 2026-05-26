import axios, { type AxiosInstance } from "axios";
import { baseURL } from "./endpoints";

export const axiosInstance:AxiosInstance = axios.create({
    baseURL
})