import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  // baseURL: `https://collaborative-study-platform-server-swart.vercel.app`,
  baseURL: `http://localhost:3000`,
  withCredentials: true,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
