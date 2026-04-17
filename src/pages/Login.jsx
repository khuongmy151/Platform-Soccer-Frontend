import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { loginAPI } from "../services/userService";
// Nếu bạn có react-icons thì dùng, không thì mình dùng SVG cho nhẹ nhé
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoMailOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { setIsLogin } from "../stores/features/authSlice";
import { toast } from "react-toastify";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAPI(formData);
      const token =
        response?.data?.token || response?.token || response?.access_token;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userEmail", formData.email);
        dispatch(setIsLogin(true));

        // Lấy tên từ email (vd: alex@gmail.com -> Alex)
        const rawName = formData.email.split("@")[0];
        const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        // HIỂN THỊ TOAST THÀNH CÔNG THEO MOCKUP
        toast.success(
          <div>
            <div className="font-bold text-slate-800 text-[15px] mb-0.5">
              Login Successful
            </div>
            <div className="text-slate-500 text-xs">
              Welcome back,{" "}
              <span className="text-[#BA0022] font-bold">{userName}</span>! You
              have successfully logged in.
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      // ĐỔI ALERT THÀNH TOAST LỖI CHO ĐỒNG BỘ GIAO DIỆN
      toast.error(
        <div>
          <div className="font-bold text-slate-800 text-[15px] mb-0.5">
            Login Failed
          </div>
          <div className="text-slate-500 text-xs">
            {error.response?.data?.message ||
              "Vui lòng kiểm tra lại email và mật khẩu!"}
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        }
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex w-full h-screen overflow-hidden">
        {/* CỘT TRÁI: BANNER ĐỎ RỰC */}
        <div className="relative hidden w-[45%] lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E10019] via-[#8B0011] to-[#000000]" />

          <div className="absolute top-10 left-10 flex items-center gap-3 z-20">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-md">
              <img
                src={logo}
                alt="SP Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Soccer Platform
            </span>
          </div>

          <div className="absolute bottom-20 left-12 right-12 z-20">
            <h2 className="text-white text-7xl font-bold leading-[0.9] tracking-tighter uppercase mb-6">
              Master the <br /> Soccer Platform
            </h2>
            <p className="text-white/80 text-lg max-w-md font-medium leading-relaxed">
              Join the premier network for professional football tournament
              management and real-time athletic analytics.
            </p>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="flex flex-1 flex-col justify-center items-center px-10 bg-white">
          <div className="w-full max-w-[440px]">
            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
              Welcome
            </h1>
            <p className="text-slate-500 font-medium mb-10 text-sm">
              Enter your credentials to access the Arena.
            </p>

            {/* Nút Login with Google */}
            <button className="flex w-full items-center justify-center gap-3 border border-slate-200 py-3 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-all mb-8 shadow-sm text-sm">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="google"
              />
              Login with Google
            </button>

            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                or
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 group-focus-within:text-[#FF0000]">
                  Email Address
                </label>
                <div className="flex items-center border-b border-slate-200 py-2 group-focus-within:border-[#FF0000] transition-colors">
                  <IoMailOutline className="text-slate-400 text-xl mr-3" />
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleInputChange}
                    placeholder="Email address"
                    autoComplete="off"
                    className="w-full outline-none text-slate-800 font-semibold placeholder:text-slate-300 bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 group-focus-within:text-[#FF0000]">
                  Password
                </label>
                <div className="flex items-center border-b border-slate-200 py-2 group-focus-within:border-[#FF0000] transition-colors">
                  <IoLockClosedOutline className="text-slate-400 text-xl mr-3" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={handleInputChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="w-full outline-none text-slate-800 font-semibold placeholder:text-slate-300 bg-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 ml-2"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#FF0000] rounded border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-500">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  virtual="true"
                  className="text-xs font-black text-[#FF0000] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Nút LOGIN */}
              <button
                data-umami-event="Login button click"
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B00] text-white font-black uppercase tracking-widest rounded-lg shadow-[0_10px_20px_rgba(255,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,0,0,0.4)] active:scale-[0.98] transition-all text-sm"
              >
                Login
              </button>
            </form>

            <p className="mt-12 text-center text-slate-400 font-bold text-xs uppercase tracking-tighter">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#FF0000] hover:underline decoration-2 ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
