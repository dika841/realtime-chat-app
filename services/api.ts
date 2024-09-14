import axios, { AxiosRequestConfig } from "axios";

const configApi: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  };
export const api = axios.create(configApi);
  