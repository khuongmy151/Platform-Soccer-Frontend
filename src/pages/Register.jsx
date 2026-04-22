import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// IMPORT LOGO CỦA BẠN VÀO ĐÂY
import logo from "../assets/logo.svg";
import { registerAPI } from "../services/userService";
import { toast } from "react-toastify";
import validateForm from "../helpers/validateForm";

export const Register = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    errorFullName: "",
    errorEmail: "",
    errorPassword: "",
  });

  // Hàm xử lý khi gõ vào ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ errorFullName: "", errorEmail: "", errorPassword: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      validateForm.validateFormAuth({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        setError,
      })
    ) {
      try {
        const response = await registerAPI(formData);
        if (response && response.success === false) {
          alert(response.message || "Registration failed!");
          return;
        }
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Registration failed. Please try again!";
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex w-full h-screen overflow-hidden">
        {/* CỘT TRÁI: BANNER ĐỎ RỰC (Giống hệt trang Login) */}
        <div className="relative hidden w-[45%] lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E10019] via-[#8B0011] to-[#000000]" />

          {/* LOGO GÓC TRÁI TRONG VÒNG TRÒN TRẮNG */}
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

          {/* TEXT BANNER PHÍA DƯỚI */}
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

        {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
        <div className="flex flex-1 flex-col items-center px-10 bg-white overflow-y-auto">
          <div className="w-full max-w-[440px] pt-20 pb-10">
            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
              Register
            </h1>
            <p className="text-slate-500 font-medium mb-10">
              Step into the future of sports management.
            </p>

            <form onSubmit={handleRegister} className="space-y-8">
              {/* Ô Input Full Name */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 group-focus-within:text-red-500">
                  Full Name
                </label>
                <div className="flex items-center border-b-2 border-slate-200 py-2 group-focus-within:border-red-600 transition-colors">
                  <input
                    name="fullName"
                    type="text"
                    onChange={handleInputChange}
                    placeholder="Full name"
                    autoComplete="off"
                    className="w-full outline-none text-slate-800 font-semibold placeholder:text-slate-300 bg-transparent"
                  />
                </div>
                <span className="text-brand-primary text-label-sm">
                  {error.errorFullName}
                </span>
              </div>

              {/* Ô Input Email */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 group-focus-within:text-red-500">
                  Email Address
                </label>
                <div className="flex items-center border-b-2 border-slate-200 py-2 group-focus-within:border-red-600 transition-colors">
                  <input
                    name="email"
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Email address"
                    className="w-full outline-none text-slate-800 font-semibold placeholder:text-slate-300 bg-transparent"
                  />
                </div>
                <span className="text-brand-primary text-label-sm">
                  {error.errorEmail}
                </span>
              </div>

              {/* Ô Input Password */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 group-focus-within:text-red-500">
                  Password
                </label>
                <div className="flex items-center border-b-2 border-slate-200 py-2 group-focus-within:border-red-600 transition-colors">
                  <input
                    name="password"
                    type="password"
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    placeholder="Password"
                    className="w-full outline-none text-slate-800 font-semibold placeholder:text-slate-300 bg-transparent"
                  />
                </div>
                <span className="text-brand-primary text-label-sm">
                  {error.errorPassword}
                </span>
              </div>

              {/* NÚT JOIN NOW: GRADIENT ĐỎ CAM */}
              <button
                data-umami-event="Register button click"
                type="submit"
                className="w-full py-4 mt-10 bg-[#FF0032] text-white font-black uppercase tracking-widest rounded-lg shadow-[0_10px_30px_rgba(255,0,50,0.3)] hover:shadow-[0_15px_40px_rgba(255,0,50,0.5)] active:scale-95 transition-all"
              >
                Join Now
              </button>
            </form>

            <p className="mt-12 text-center text-slate-400 font-bold text-sm uppercase tracking-tighter">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-600 hover:underline decoration-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
