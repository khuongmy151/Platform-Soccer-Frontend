import { axiosClient } from "./axiosClient";

const matchService = {
  getAllMatches: async ({ url, dispatch, func, params }) => {
    try {
      const result = await axiosClient.get(`${url}`, { params });
      // Lấy mảng dữ liệu thật (vì API mới bọc trong result.data)
      const dataToDispatch = result.data !== undefined ? result.data : result;
      dispatch(func(dataToDispatch || []));
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  getMatchDetail: async ({ url, params }) => {
    try {
      const result = await axiosClient.get(`${url}`, { params });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createMatch: async ({ url, data }) => {
    try {
      const result = await axiosClient.post(`${url}`, data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateMatchStatus: async ({ url, data }) => {
    try {
      const result = await axiosClient.put(`${url}`, data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  submitMatchStats: async ({ url, data }) => {
    try {
      const result = await axiosClient.put(`${url}`, data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  submitMatchResult: async ({ url, data }) => {
    try {
      const result = await axiosClient.post(`${url}`, data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  submitMatchEvent: async ({ url, data }) => {
    try {
      const result = await axiosClient.post(`${url}`, data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

export default matchService;
