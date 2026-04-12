import { axiosClient } from "../services/axiosClient";
export const teamService = {
  getAllTeam: async ({ url, params, dispatch, func }) => {
    const result = await axiosClient.get(`${url}`, { params });
    console.log(result.data);
    dispatch(func(result.data || []));
    return result;
  },
  getTeamById: async ({ url, setData }) => {
    const result = await axiosClient.get(`${url}`);
    setData(result.data || null);
    return result;
  },
};
