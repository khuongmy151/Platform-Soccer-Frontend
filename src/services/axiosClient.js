import axios from "axios";
// File cấu hình axios dùng chung cho toàn bộ dự án
export const axiosClient = axios.create({
  baseURL: "https://backend.cupzone.fun/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Chỉ định định dạng dữ liệu gửi đi
  },
});
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // Nếu có token thì đính kèm request gửi về server
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Các status lỗi khác nhau sẽ xử lý sau
    return Promise.reject(error);
  }
);
