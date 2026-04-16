import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileAPI } from '../../services/userService';

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
    profileData: {
      fullName: "Đang tải...",
      email: "Đang tải...",
      phone: "",
      avatarUrl: "https://i.pravatar.cc/150?img=11" // LUÔN LẤY ẢNH NÀY CHỜ BACKEND
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      if (state.profileData) {
        state.profileData[field] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const userData = action.payload.data; 

        if (userData) {
          
          /* TẠM KHÓA LOGIC NỐI LINK ẢNH TỪ BACKEND
          const BACKEND_URL = "https://backend.cupzone.fun";
          let finalAvatarUrl = state.profileData.avatarUrl;

          if (userData.avatar_url) {
            if (userData.avatar_url.startsWith('http')) {
              finalAvatarUrl = userData.avatar_url;
            } else {
              const path = userData.avatar_url.startsWith('/') ? userData.avatar_url : `/${userData.avatar_url}`;
              finalAvatarUrl = `${BACKEND_URL}${path}?t=${new Date().getTime()}`;
            }
          }
          */

          state.profileData = {
            ...state.profileData,
            fullName: userData.full_name || state.profileData.fullName,
            email: userData.email || state.profileData.email, 
            phone: userData.phone || state.profileData.phone,
            
            // ÉP KIỂU LẤY ẢNH MẶC ĐỊNH
            avatarUrl: state.profileData.avatarUrl 
          };
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.profileData.fullName = "Lỗi tải dữ liệu";
        state.profileData.email = "Không xác định";
      });
  }
});

export const { updateField } = userSlice.actions;
export default userSlice.reducer;