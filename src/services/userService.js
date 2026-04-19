import { toast } from "react-toastify";
import { axiosClient } from "./axiosClient";

export const loginAPI = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

export const getMe = async ({ url, dispatch, func }) => {
  const response = await axiosClient.get(`${url}`);
  const data = response.data || response;
  dispatch(func(data || null));
  console.log("Dữ liệu gốc từ Backend trả về:", response.data);
  return response;
};

export const registerAPI = async (data) => {
  const payload = {
    full_name: data.fullName,
    email: data.email,
    password: data.password,
  };
  const response = await axiosClient.post("/auth/register", payload);
  return response.data;
};

export const updateProfileAPI = async (data, token) => {
  const response = await axiosClient.put("/users/me", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response);
  toast.success(response?.message);
  return response.data;
};

export const changePasswordAPI = async (passwordData, token) => {
  const response = await axiosClient.put(
    "/auth/change-password",
    passwordData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const uploadAvatarAPI = async (imageFile, token) => {
  const formData = new FormData();
  formData.append("avatar", imageFile); // Nhãn dán chuẩn là 'avatar'

  return await axiosClient.post("/users/me/avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAccountAPI = async () => {
  return { message: "Chức năng đang chờ backend" };
};
