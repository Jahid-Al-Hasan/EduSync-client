import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  baseURL: `https://collaborative-study-platform-server-swart.vercel.app`,
  withCredentials: true,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
