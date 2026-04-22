import { axiosClient } from "./axiosClient";

export const tournamentService = {
  // Hàm tổng quát cho tất cả request
  getAllTournament: async ({ url, dispatch, func, params }) => {
    try {
      const response = await axiosClient.get(url, { params });
      const result = response.data || [];
      console.log(result);
      dispatch(func(result?.data || result || []));
      return result;
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // Lấy chi tiết 1 giải đấu theo ID (dùng list API rồi filter vì backend không có GET /tournaments/:id)
  getTournamentById: async (id) => {
    const response = await axiosClient.get("/tournaments");
    const tournaments = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
    return tournaments.find((t) => String(t.id) === String(id)) || null;
  },

  // Tạo giải đấu mới
  createTournament: async (data) => {
    return await axiosClient.post("/tournaments", data);
  },

  // Cập nhật giải đấu
  updateTournament: async (url, data) => {
    return await axiosClient.put(`${url}`, data);
  },

  // Xóa giải đấu
  deleteTournament: async (id) => {
    return await axiosClient.delete(`/tournaments/${id}`);
  },
};
