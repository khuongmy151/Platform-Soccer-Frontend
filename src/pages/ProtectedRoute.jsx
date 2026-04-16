import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");

  // Nếu không có token, trả về component Navigate để đá sang trang login ngay lập tức
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //Nếu có token, cho phép đi tiếp vào các route con
  return <Outlet />;
};

export default ProtectedRoute;
