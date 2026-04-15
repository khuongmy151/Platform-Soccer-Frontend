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
  deleteTeam: ({ id, dispatch, func }) => {
    dispatch(func(id));
  },
  updateTeam: ({ team, dispatch, func }) => {
    dispatch(func(team));
  },
};
