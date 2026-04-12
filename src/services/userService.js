import axios from 'axios';

// Thiết lập Base URL mới theo yêu cầu của bạn
const api = axios.create({
  baseURL: 'https://backend.cupzone.fun', 
});

// ==========================================
// 1. LẤY THÔNG TIN CỦA TÔI (GET /users/me)
// ==========================================
// export const getProfileAPI = async (token) => {
//   const response = await api.get('/users/me', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };
export const getProfileAPI = async (token) => {
  // Tạm thời gọi vào /users để test dữ liệu có sẵn
  const response = await api.get('/users', {
    // Nếu Backend của bạn đang mở public (không cần token), dòng headers này có thể bỏ qua, 
    // nhưng cứ để lại cũng không sao.
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==========================================
// 2. CẬP NHẬT THÔNG TIN (PUT /users/me)
// ==========================================
export const updateProfileAPI = async (data, token) => {
  // Đảm bảo data gửi đi khớp với Payload mà Backend yêu cầu
  const response = await api.put('/users/me', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==========================================
// 3. ĐỔI MẬT KHẨU (PUT /auth/change-password)
// Lưu ý: Dựa trên ảnh bạn gửi, đổi pass nằm trong nhánh /auth
// ==========================================
export const changePasswordAPI = async (passwordData, token) => {
  const response = await api.put('/auth/change-password', passwordData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==========================================
// 4. CẬP NHẬT AVATAR (POST /users/me/avatar)
// ==========================================
export const uploadAvatarAPI = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('file', imageFile); 

  const response = await api.post('/users/me/avatar', formData, {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Hàm giả định cho Delete Account để tránh lỗi import
export const deleteAccountAPI = async () => { // <--- Đã xóa chữ token ở đây
  console.warn("Endpoint xóa tài khoản chưa được định nghĩa rõ ràng trong ảnh.");
  return { message: "Chức năng đang chờ backend" };
};