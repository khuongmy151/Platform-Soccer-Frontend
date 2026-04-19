import { toast } from "react-toastify";
import { axiosClient } from "../services/axiosClient";
export const teamService = {
  getAllTeam: async ({ url, params, dispatch, func }) => {
    const result = await axiosClient.get(`${url}`, { params });
    const data = result?.data || result;
    console.log(data);
    dispatch(func(data || []));
    return data;
  },
  getTeamById: async ({ url, setData }) => {
    try {
      const result = await axiosClient.get(`${url}`);
      setData(result.data || null);
      return result;
    } catch {
      console.log("Lỗi mạng");
    }
  },
  createTeam: async ({ url, data }) => {
    const response = await axiosClient.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    toast.success(response?.message);
  },
  deleteTeam: async ({ url }) => {
    const response = await axiosClient.delete(`${url}`);
    console.log(response);
    toast.success(response?.message);
  },
  updateTeam: async ({ url, data }) => {
    const response = await axiosClient.put(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    toast.success(response?.message);
  },
};
