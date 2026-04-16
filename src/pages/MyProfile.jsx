import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateField } from "../stores/features/userSlice";
import { updateProfileAPI, uploadAvatarAPI } from "../services/userService";

export const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);

  const { profileData } = useSelector((state) => state.user);
  
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("············");
  const [selectedFile, setSelectedFile] = useState(null);

  // LẤY EMAIL TỪ LOCALSTORAGE ĐỂ HIỂN THỊ
  const savedEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); 
    if (token) {
      dispatch(fetchUserProfile(token)); 
    } else {
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      navigate('/login'); 
    }
  }, [dispatch, navigate]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      const imageUrl = URL.createObjectURL(file);
      dispatch(updateField({ field: "avatarUrl", value: imageUrl }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Hết phiên làm việc!");

      if (selectedFile) {
        await uploadAvatarAPI(selectedFile, token);
        setSelectedFile(null); 
      }

      const dataToSend = {
        full_name: profileData.fullName,
        phone: profileData.phone || "",
      };
      await updateProfileAPI(dataToSend, token);
      
      await dispatch(fetchUserProfile(token));

      alert("Lưu thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu thông tin!");
    }
  };

  const handleChangePassword = async () => {
    if (password === "············" || password === "") return alert("Vui lòng nhập mật khẩu mới!");
    try {
      console.log("Chức năng đổi mật khẩu đang chờ Backend");
    } catch (error) {
      console.error(error);
      alert("Lỗi đổi mật khẩu!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail"); // Xóa luôn email khi đăng xuất
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa tài khoản không?");
    if (!isConfirm) return;
    try {
      console.log("Chức năng xóa tài khoản đang chờ Backend");
    } catch (error) {
      console.error(error);
      alert("Lỗi xóa tài khoản!");
    }
  };

  const handleInputChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };

  return (
    <div className="flex flex-col items-start gap-2.5 relative bg-[#f5f6fa]">
      <div className="flex h-[743px] items-start gap-8 pt-32 pb-20 px-8 relative self-stretch w-full">
        <div className="flex flex-col w-[calc(100%_-_192px)] h-[597px] items-start absolute top-[100px] left-40 bg-white rounded-3xl overflow-hidden shadow-[0px_32px_64px_#ba00220a]">
          
          <div className="relative self-stretch w-full h-[108px] bg-[#eff1f5]">
            <div className="flex flex-col w-full h-full items-start absolute top-0 left-0 opacity-10">
              <div className="relative flex-1 self-stretch w-full grow [background:radial-gradient(50%_50%_at_26%_55%,rgba(255,0,51,1)_0%,rgba(255,0,51,0)_60%)]" />
            </div>
            
            <div className="flex w-[calc(100%_-_64px)] items-end gap-6 absolute left-8 -bottom-20">
              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <div 
                  onClick={handleAvatarClick}
                  className="group relative flex flex-col w-40 h-40 items-start justify-center bg-[#e0e2e8] rounded-full overflow-hidden border-4 border-solid border-white shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] cursor-pointer"
                >
                  <div 
                    className="relative flex-1 self-stretch w-full grow bg-cover bg-[50%_50%] transition-transform duration-300 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${profileData.avatarUrl}')` }}
                  />
                  
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Thay đổi ảnh</span>
                  </div>

                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="relative flex-1 grow">
                <div className="flex flex-col w-full items-start relative -top-5 -left-3.5">
                  <div className="relative flex items-center self-stretch mt-[-1.00px] font-display font-normal text-[#2c2f32] text-4xl tracking-[-1.80px] leading-10 uppercase">
                    {profileData.fullName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[1088px] items-start gap-16 pt-20 pb-12 px-8 absolute top-[140px] left-0">
            <div className="grid grid-cols-2 grid-rows-[84px_88px] h-fit gap-[40px_32px]">
              {/* Full Name */}
              <div className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-2">
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="fullName" className="relative flex items-center self-stretch mt-[-1.00px] text-[#595c5f] text-[10px] font-bold tracking-[1.00px] leading-[15px] uppercase">
                    Full Name
                  </label>
                </div>
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center px-1 py-2 relative self-stretch w-full flex-[0_0_auto] border-b-2 border-[#abadb1]">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="relative flex items-center self-stretch mt-[-1.00px] text-[#2c2f32] text-base tracking-[0] leading-6 w-full border-none bg-transparent outline-none p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Email - ĐÃ CẬP NHẬT BIẾN savedEmail */}
              <div className="relative row-[1_/_2] col-[2_/_3] w-full h-fit flex flex-col items-start gap-2">
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="emailAddress" className="relative flex items-center self-stretch mt-[-1.00px] text-[#595c5f] text-[10px] font-bold tracking-[1.00px] leading-[15px] uppercase">
                    Email Address
                  </label>
                </div>
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center px-1 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#eff1f5] border-b-2 border-transparent">
                    <input
                      id="emailAddress"
                      className="relative grow border-none bg-transparent self-stretch mt-[-1.00px] text-zinc-400 text-base tracking-[0] leading-6 p-0 outline-none"
                      type="email"
                      value={savedEmail} 
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="relative row-[2_/_3] col-[1_/_2] justify-self-start w-[832px] h-fit flex flex-col items-start gap-2">
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="password" className="relative flex items-center self-stretch mt-[-1.00px] text-[#595c5f] text-[10px] font-bold tracking-[1.00px] leading-[15px] uppercase">
                    Password
                  </label>
                </div>
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center px-1 py-2 relative self-stretch w-full flex-[0_0_auto] border-b-2 border-[#abadb1]">
                    <input
                      id="password"
                      className="relative grow border-none bg-transparent self-stretch text-[#2c2f32] text-base tracking-[0] leading-6 mt-[-1.00px] p-0 outline-none"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => { if(password==="············") setPassword("") }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                className="all-[unset] box-border absolute top-[152px] left-[853px] flex-col px-4 py-2 rounded-lg bg-[linear-gradient(90deg,rgba(255,0,51,1)_0%,rgba(255,109,0,1)_100%)] inline-flex items-center justify-center cursor-pointer hover:opacity-90"
              >
                <div className="justify-center w-fit text-white font-bold text-[10px] text-center tracking-[1.00px] leading-[15px] whitespace-nowrap relative flex items-center mt-[-1.00px]">
                  CHANGE PASSWORD
                </div>
              </button>
            </div>

            {/* Footer Buttons Section */}
            <div className="flex w-[calc(100%_-_64px)] items-center gap-4 pt-8 pb-0 px-0 absolute top-[306px] left-8 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="all-[unset] box-border flex-col px-10 py-4 relative flex-[0_0_auto] rounded-xl bg-[linear-gradient(90deg,rgba(255,0,51,1)_0%,rgba(255,109,0,1)_100%)] inline-flex items-center justify-center cursor-pointer hover:opacity-90"
              >
                <div className="justify-center w-fit text-white font-bold text-sm text-center tracking-[1.40px] leading-5 whitespace-nowrap relative flex items-center mt-[-1.00px]">
                  SAVE CHANGES
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="all-[unset] box-border flex-col px-10 py-4 relative flex-[0_0_auto] bg-[#e0e2e8] rounded-xl inline-flex items-center justify-center cursor-pointer hover:bg-gray-300"
              >
                <div className="justify-center w-fit text-[#2c2f32] font-bold text-sm text-center tracking-[1.40px] leading-5 whitespace-nowrap relative flex items-center mt-[-1.00px]">
                  CANCEL
                </div>
              </button>

              {/* KHU VỰC NÚT PHẢI */}
              <div className="flex flex-1 items-center justify-end gap-8">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="all-[unset] cursor-pointer group"
                >
                  <div className="text-slate-400 font-bold text-xs tracking-[1.20px] group-hover:text-[#BA0022] transition-colors uppercase">
                    Logout
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="all-[unset] cursor-pointer hover:opacity-80"
                >
                  <div className="text-[#b02500] font-bold text-xs tracking-[1.20px] uppercase">
                    Delete Account
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;