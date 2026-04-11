// File cấu hình chung dùng cho toàn bộ dự án
import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: {}, // Tạm thời để trống, sẽ bổ sung các Slice khi phát triển tính năng
});
