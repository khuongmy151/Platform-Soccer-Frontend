import { axiosClient } from "./axiosClient";

// ============================================================
// Player Service
// Tập hợp toàn bộ hàm gọi API liên quan đến Player.
// Component KHÔNG được gọi axios trực tiếp, luôn gọi qua đây.
// ============================================================

const PLAYER_ENDPOINT = "/api/players";

// Lấy danh sách toàn bộ player (roster)
export const getAllPlayers = async () => {
  try {
    const data = await axiosClient.get(PLAYER_ENDPOINT);
    return data;
  } catch (error) {
    console.error("getAllPlayers error:", error);
    throw error;
  }
};

// Lấy chi tiết 1 player theo id
export const getPlayerById = async (playerId) => {
  try {
    const data = await axiosClient.get(`${PLAYER_ENDPOINT}/${playerId}`);
    return data;
  } catch (error) {
    console.error("getPlayerById error:", error);
    throw error;
  }
};

// Tạo mới 1 player
// payload: { name, height, weight, preferredFoot, mainPosition, avatarUrl }
export const createPlayer = async (payload) => {
  try {
    const data = await axiosClient.post(PLAYER_ENDPOINT, payload);
    return data;
  } catch (error) {
    console.error("createPlayer error:", error);
    throw error;
  }
};

// Cập nhật thông tin player
export const updatePlayer = async (playerId, payload) => {
  try {
    const data = await axiosClient.put(
      `${PLAYER_ENDPOINT}/${playerId}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("updatePlayer error:", error);
    throw error;
  }
};

// Xoá player khỏi roster
export const removePlayer = async (playerId) => {
  try {
    const data = await axiosClient.delete(`${PLAYER_ENDPOINT}/${playerId}`);
    return data;
  } catch (error) {
    console.error("removePlayer error:", error);
    throw error;
  }
};

// Upload ảnh avatar cho player (dạng multipart/form-data)
// file: File object từ input type=file
export const uploadPlayerAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const data = await axiosClient.post(
      `${PLAYER_ENDPOINT}/upload-avatar`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  } catch (error) {
    console.error("uploadPlayerAvatar error:", error);
    throw error;
  }
};

// ============================================================
// Helper: Validate dữ liệu form trước khi gửi API
// Trả về { valid: boolean, errors: {field: message} }
// ============================================================
export const validatePlayerForm = (form) => {
  const errors = {};
  if (!form.name || !form.name.trim()) {
    errors.name = "Vui lòng nhập tên cầu thủ";
  }
  if (!form.height || Number(form.height) <= 0) {
    errors.height = "Chiều cao không hợp lệ";
  }
  if (!form.weight || Number(form.weight) <= 0) {
    errors.weight = "Cân nặng không hợp lệ";
  }
  if (!form.preferredFoot) {
    errors.preferredFoot = "Vui lòng chọn chân thuận";
  }
  if (!form.mainPosition || !form.mainPosition.trim()) {
    errors.mainPosition = "Vui lòng nhập vị trí thi đấu";
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

// ============================================================
// Fallback mock data dùng khi backend chưa sẵn sàng
// Giúp UI vẫn render được khi dev offline
// ============================================================
export const getMockPlayers = () => {
  return [
    {
      id: 1,
      name: "Marcus Valentine",
      height: 96,
      weight: 92,
      preferredFoot: "RIGHT",
      mainPosition: "ST",
      avatarUrl:
        "https://images.pexels.com/photos/33105906/pexels-photo-33105906.jpeg?w=400",
    },
    {
      id: 2,
      name: "Leo Hart",
      height: 180,
      weight: 75,
      preferredFoot: "LEFT",
      mainPosition: "CM",
      avatarUrl:
        "https://images.pexels.com/photos/31605981/pexels-photo-31605981.jpeg?w=400",
    },
    {
      id: 3,
      name: "Diego Santos",
      height: 178,
      weight: 74,
      preferredFoot: "RIGHT",
      mainPosition: "CB",
      avatarUrl:
        "https://images.pexels.com/photos/15644449/pexels-photo-15644449.jpeg?w=400",
    },
    {
      id: 4,
      name: "Kai Bennett",
      height: 185,
      weight: 80,
      preferredFoot: "BOTH",
      mainPosition: "GK",
      avatarUrl:
        "https://images.pexels.com/photos/12430247/pexels-photo-12430247.jpeg?w=400",
    },
    {
      id: 5,
      name: "Ryo Tanaka",
      height: 172,
      weight: 68,
      preferredFoot: "LEFT",
      mainPosition: "LW",
      avatarUrl:
        "https://images.pexels.com/photos/31543237/pexels-photo-31543237.jpeg?w=400",
    },
  ];
};
