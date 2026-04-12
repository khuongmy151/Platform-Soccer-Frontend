import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileAPI } from '../../services/userService';

// Hành động gọi API lấy dữ liệu từ Backend
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (token, thunkAPI) => {
    try {
      const data = await getProfileAPI(token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    // Dữ liệu mặc định khi vừa mở web
    profileData: {
      fullName: "Đang tải...",
      email: "Đang tải...",
      phone: "",
      // organization: "",
      // bio: "",
      avatarUrl: "https://i.pravatar.cc/150?img=11"
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    // Hàm này giúp cập nhật ô input ngay lập tức khi người dùng gõ phím
    updateField: (state, action) => {
      const { field, value } = action.payload;
      if (state.profileData) {
        state.profileData[field] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
     .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Trích xuất cục 'data' từ Backend trả về
        const backendData = action.payload.data; 
        
        if (backendData) {
          // Phiên dịch từ Backend (snake_case) sang Frontend (camelCase)
          state.profileData = {
            ...state.profileData,
            fullName: backendData.full_name || state.profileData.fullName,
            email: backendData.email || state.profileData.email,
            phone: backendData.phone || state.profileData.phone,
            avatarUrl: backendData.avatar_url || state.profileData.avatarUrl
          };
        }
      })
  }
});

export const { updateField } = userSlice.actions;
export default userSlice.reducer;