import { axiosClient } from "./axiosClient";

export const tournamentService = {
  // Hàm tổng quát cho tất cả request
  getAllTournament: async ({ url, dispatch, func, params }) => {
    try {
      const response = await axiosClient.get(url, { params });
      const result = response;
      console.log(result);
      dispatch(func(result || []));
      return result;
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // Lấy chi tiết 1 giải đấu theo ID (dùng list API rồi filter vì backend không có GET /tournaments/:id)
  getTournamentById: async (id) => {
    return await axiosClient.get("/tournaments");
  },

  // Tạo giải đấu mới
  createTournament: async (data) => {
    return await axiosClient.post("/tournaments", data);
  },

  // Cập nhật giải đấu
  updateTournament: async (id, data) => {
    return await axiosClient.put(`/tournaments/${id}`, data);
  },

  // Xóa giải đấu
  deleteTournament: async (id) => {
    return await axiosClient.delete(`/tournaments/${id}`);
  }
};


