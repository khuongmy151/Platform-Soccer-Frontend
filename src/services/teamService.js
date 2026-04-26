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
    const result = await axiosClient.get(`${url}`);
    setData(result.data || null);
    return result;
  },
  deleteTeam: async ({ url }) => {
    const response = await axiosClient.delete(`${url}`);
    console.log(response);
    toast.success(response?.message || "Delete successfully");
  },
  updateTeam: async ({ url, data }) => {
    const response = await axiosClient.put(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    toast.success(response?.message || "Update successfully");
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
  // Get team members list
  getTeamMembers: async ({ url }) => {
    const response = await axiosClient.get(`${url}`);
    return response;
  },
  getTeamMemberById: async ({ url }) => {
    const response = await axiosClient.get(`${url}`);
    return response;
  },
  // Add members to team
  addTeamMembers: async ({ url, data }) => {
    const config =
      data instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : undefined;
    const response = await axiosClient.post(`${url}`, data, config);
    toast.success(response?.message || "Members added successfully");
    return response;
  },
  // Remove a member from team
  removeTeamMember: async ({ url }) => {
    const response = await axiosClient.delete(`${url}`);
    toast.success(response?.message || "Member removed successfully");
    return response;
  },
};
