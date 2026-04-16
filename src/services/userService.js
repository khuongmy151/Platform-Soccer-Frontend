import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend.cupzone.fun', 
});

// ==========================================
// ĐĂNG NHẬP
// ==========================================
export const loginAPI = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// ==========================================
// 1. LẤY THÔNG TIN CÁ NHÂN (SỬA LẠI Ở ĐÂY)
// ==========================================
export const getProfileAPI = async (token) => {
  
  const response = await api.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // LOG để Đạt kiểm tra xem cục data trả về có email không
  console.log("Dữ liệu gốc từ Backend trả về:", response.data);
  
  return response.data;
};

// ==========================================
// ĐĂNG KÝ
// ==========================================
export const registerAPI = async (data) => {
  const payload = {
    full_name: data.fullName,
    email: data.email,
    password: data.password
  };
  const response = await api.post('/auth/register', payload);
  return response.data;
};

// ==========================================
// 2. CẬP NHẬT THÔNG TIN
// ==========================================
export const updateProfileAPI = async (data, token) => {
  const response = await api.put('/users/me', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==========================================
// 3. ĐỔI MẬT KHẨU
// ==========================================
export const changePasswordAPI = async (passwordData, token) => {
  const response = await api.put('/auth/change-password', passwordData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==========================================
// 4. UPLOAD AVATAR
// ==========================================
export const uploadAvatarAPI = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('avatar', imageFile); // Nhãn dán chuẩn là 'avatar'
  
  return await api.post('/users/me/avatar', formData, {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteAccountAPI = async () => {
  return { message: "Chức năng đang chờ backend" };
};