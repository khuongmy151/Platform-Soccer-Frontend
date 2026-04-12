import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateField } from "../stores/features/userSlice";
import { updateProfileAPI, changePasswordAPI } from "../services/userService";

export const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Rút dữ liệu từ kho Redux ra
  const { profileData } = useSelector((state) => state.user);
  
  // State cục bộ cho phần đổi mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("············");

  const navItems = [
    // { label: "DASHBOARD", active: false },
    // { label: "TEAM", active: true },
    // { label: "TACTICS", active: false },
    // { label: "TRANSFERS", active: false },
    // { label: "ACADEMY", active: false },
  ];

  // ==========================================
  // 1. TẢI DỮ LIỆU KHI MỞ TRANG
  // ==========================================
useEffect(() => {
    // console.log("=== BƯỚC 1: Vừa mở trang Profile ===");
    
    // // LƯU Ý: Sửa chữ "accessToken" thành tên đúng mà team bạn đang dùng để lưu token nhé!
    // const token = localStorage.getItem("accessToken"); 
    // console.log("=== BƯỚC 2: Token tìm thấy trong máy là: ===", token);
    
    // if (token) {
    //   console.log("=== BƯỚC 3: Đã có khóa! Tiến hành gọi API GET /users/me ===");
    //   dispatch(fetchUserProfile(token)); 
    // } else {
    //   console.error("❌ LỖI: KHÔNG TÌM THẤY TOKEN! API SẼ KHÔNG CHẠY.");
    //   alert("Bạn chưa đăng nhập hoặc mất Token. Vui lòng quay lại trang Login để đăng nhập nhé!");
    //   // navigate('/login'); // Bật dòng này lên nếu muốn đuổi user về trang login
    // }
    console.log("=== CHẾ ĐỘ TEST: Đang ép gọi API không cần Login ===");
    
    // Truyền bừa một chuỗi làm token giả để kích hoạt Redux đi gọi API
    const fakeToken = "token-tam-thoi-de-test"; 
    
    dispatch(fetchUserProfile(fakeToken));
  }, [dispatch]);

  // ==========================================
  // 2. XỬ LÝ LƯU THAY ĐỔI
  // ==========================================
  const handleSaveChanges = async () => {
  try {
      const token = localStorage.getItem("accessToken");
      
      // PHIÊN DỊCH TỪ FRONTEND SANG BACKEND TRƯỚC KHI GỬI
      const dataToSend = {
        full_name: profileData.fullName,
        phone: profileData.phone,
        // Backend thường không cho sửa email, nên mình không gửi email lên
      };

      console.log("Đang gửi data chuẩn lên server:", dataToSend);
      
      // Gọi API với data đã được đóng gói chuẩn
      await updateProfileAPI(dataToSend, token);
      alert("Lưu thông tin thành công!");
      
    } catch (error) {
      alert("Lỗi khi lưu thông tin! Hãy check console.");
      console.error("Chi tiết lỗi:", error);
    }
  };

  // ==========================================
  // 3. XỬ LÝ ĐỔI MẬT KHẨU
  // ==========================================
  const handleChangePassword = async () => {
    if (password === "············" || password === "") return alert("Vui lòng nhập mật khẩu mới!");
    try {
      const token = localStorage.getItem("accessToken");
      
      // TODO: Khi có Backend, bật 2 dòng dưới lên
      // await changePasswordAPI({ newPassword: password }, token);
      // alert("Đổi mật khẩu thành công!");
    } catch (error) {
      alert("Lỗi đổi mật khẩu!");
    }
  };

  // ==========================================
  // 4. XỬ LÝ XÓA TÀI KHOẢN
  // ==========================================
  const handleDeleteAccount = async () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa tài khoản không?");
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem("accessToken");
      
      // TODO: Khi có Backend, bật các dòng dưới lên
      // await deleteAccountAPI(token);
      // localStorage.removeItem("accessToken");
      // navigate("/login");
    } catch (error) {
      alert("Lỗi xóa tài khoản!");
    }
  };

  // Hàm xử lý khi gõ vào ô input (Cập nhật Redux)
  const handleInputChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };

  return (
    <div className="flex flex-col items-start gap-2.5 relative bg-[#f5f6fa]">
      <div className="flex h-[743px] items-start gap-8 pt-32 pb-20 px-8 relative self-stretch w-full">
        {/* <div className="relative flex-[0_0_auto] mt-[-1.00px] ml-[-2.00px] w-[80px] h-full bg-[#1A1A1A] rounded-xl shadow-lg" /> */}
        <div className="flex flex-col w-[calc(100%_-_192px)] h-[597px] items-start absolute top-[100px] left-40 bg-white rounded-3xl overflow-hidden shadow-[0px_32px_64px_#ba00220a]">
          <div className="relative self-stretch w-full h-[108px] bg-[#eff1f5]">
            <div className="flex flex-col w-full h-full items-start absolute top-0 left-0 opacity-10">
              <div className="relative flex-1 self-stretch w-full grow [background:radial-gradient(50%_50%_at_26%_55%,rgba(255,0,51,1)_0%,rgba(255,0,51,0)_60%)]" />
            </div>
            <div className="flex w-[calc(100%_-_64px)] items-end gap-6 absolute left-8 -bottom-20">
              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <div className="flex flex-col w-40 h-40 items-start justify-center relative bg-[#e0e2e8] rounded-full overflow-hidden border-4 border-solid border-white shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a]">
                  <div 
                    className="relative flex-1 self-stretch w-full grow bg-cover bg-[50%_50%]" 
                    style={{ backgroundImage: `url('${profileData.avatarUrl}')` }}
                  />
                  <div className="inline-flex flex-col items-center justify-center gap-1 pl-[30.41px] pr-[30.4px] py-[54px] absolute w-[calc(100%_-_8px)] h-[calc(100%_-_14px)] top-[7px] left-1 bg-[#00000066] opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                      <svg className="relative w-5 h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                      <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                        Change Avatar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 grow">
                <div className="flex flex-col w-full items-start relative -top-5 -left-3.5">
                  <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-[#2c2f32] text-4xl tracking-[-1.80px] leading-10 uppercase">
                    {profileData.fullName}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[1088px] items-start gap-16 pt-20 pb-12 px-8 absolute top-[140px] left-0">
            <div className="grid grid-cols-2 grid-rows-[84px_88px] h-fit gap-[40px_32px]">
              <div className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-2">
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="fullName" className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-[#595c5f] text-[10px] tracking-[1.00px] leading-[15px]">
                    FULL NAME
                  </label>
                </div>
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center px-1 py-2 relative self-stretch w-full flex-[0_0_auto] border-b-2 [border-bottom-style:solid] border-[#abadb1]">
                    <div className="flex flex-col items-start relative flex-1 grow">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-[#2c2f32] text-base tracking-[0] leading-6 w-full border-none bg-transparent outline-none p-0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                    <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-zinc-400 text-[10px] tracking-[0] leading-[15px]">
                      Please enter your full legal name.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative row-[1_/_2] col-[2_/_3] w-full h-fit flex flex-col items-start gap-2">
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="emailAddress" className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-[#595c5f] text-[10px] tracking-[1.00px] leading-[15px]">
                    EMAIL ADDRESS
                  </label>
                </div>
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center px-1 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#eff1f5] border-b-2 [border-bottom-style:solid] border-transparent">
                    <input
                      id="emailAddress"
                      className="relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-zinc-400 text-base tracking-[0] leading-6 p-0 outline-none"
                      type="email"
                      value={profileData.email}
                      readOnly
                    />
                  </div>
                  <div className="inline-flex flex-col items-start absolute top-2 right-2">
                    <svg className="relative w-[12px] h-[14px] text-zinc-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                </div>
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-zinc-400 text-[10px] tracking-[0] leading-[15px]">
                    Email cannot be changed manually.
                  </p>
                </div>
              </div>
              <div className="relative row-[2_/_3] col-[1_/_2] justify-self-start w-[832px] h-fit flex flex-col items-start gap-2">
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="password" className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-[#595c5f] text-[10px] tracking-[1.00px] leading-[15px]">
                    PASSWORD
                  </label>
                </div>
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center px-1 py-2 relative self-stretch w-full flex-[0_0_auto] border-b-2 [border-bottom-style:solid] border-[#abadb1]">
                    <input
                      id="password"
                      className="relative grow border-[none] [background:none] self-stretch text-[#2c2f32] text-base tracking-[0] leading-6 mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal p-0 outline-none"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => { if(password==="············") setPassword("") }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex-col absolute top-2 right-2 inline-flex items-center justify-center cursor-pointer"
                  >
                    <div className="inline-flex items-start justify-center relative flex-[0_0_auto]">
                      <svg className="relative w-[18px] h-[14px] text-zinc-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica] font-normal text-zinc-400 text-[10px] tracking-[0] leading-[15px]">
                    Last changed 3 months ago.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleChangePassword}
                className="all-[unset] box-border absolute top-[152px] left-[853px] flex-col px-4 py-2 rounded-lg bg-[linear-gradient(90deg,rgba(255,0,51,1)_0%,rgba(255,109,0,1)_100%)] inline-flex items-center justify-center cursor-pointer hover:opacity-90"
              >
                <div className="justify-center w-fit text-white font-bold text-[10px] text-center tracking-[1.00px] leading-[15px] whitespace-nowrap relative flex items-center mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica]">
                  CHANGE PASSWORD
                </div>
              </button>
            </div>
            <div className="flex w-[calc(100%_-_64px)] items-center gap-4 pt-8 pb-0 px-0 absolute top-[306px] left-8 border-t [border-top-style:solid] border-zinc-100">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="all-[unset] box-border flex-col px-10 py-4 relative flex-[0_0_auto] rounded-xl bg-[linear-gradient(90deg,rgba(255,0,51,1)_0%,rgba(255,109,0,1)_100%)] inline-flex items-center justify-center cursor-pointer hover:opacity-90"
              >
                <div className="justify-center w-fit text-white font-bold text-sm text-center tracking-[1.40px] leading-5 whitespace-nowrap relative flex items-center mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica]">
                  SAVE CHANGES
                </div>
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="all-[unset] box-border flex-col px-10 py-4 relative flex-[0_0_auto] bg-[#e0e2e8] rounded-xl inline-flex items-center justify-center cursor-pointer hover:bg-gray-300"
              >
                <div className="justify-center w-fit text-[#2c2f32] font-bold text-sm text-center tracking-[1.40px] leading-5 whitespace-nowrap relative flex items-center mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica]">
                  CANCEL
                </div>
              </button>
              <div className="flex flex-col min-w-[133.25px] items-end pl-[309.45px] pr-0 py-0 relative flex-1 grow">
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="all-[unset] box-border relative flex-[0_0_auto] inline-flex items-center justify-center cursor-pointer hover:opacity-80"
                  >
                    <div className="justify-center w-fit text-[#b02500] font-bold text-xs text-center tracking-[1.20px] leading-4 whitespace-nowrap relative flex items-center mt-[-1.00px] [font-family:'Lexend-Regular',Helvetica]">
                      DELETE ACCOUNT
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="flex items-center justify-between px-8 py-0 bg-[#ffffffcc] border-b [border-bottom-style:solid] border-[#e2e8f033] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)] w-full h-20 absolute top-0 left-0 z-50">
        <div className="bg-[#ffffff01] shadow-[0px_10px_30px_-15px_#ba002226] w-full h-20 absolute top-0 left-0" />
        <div className="inline-flex items-center gap-8 relative flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            {/* <div className="relative flex items-center w-[186px] h-8 mt-[-1.00px] bg-[linear-gradient(90deg,rgba(255,0,51,1)_0%,rgba(255,109,0,1)_50%,rgba(255,234,0,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Lexend-Regular',Helvetica] font-bold text-transparent text-2xl tracking-[-1.20px] leading-8 whitespace-nowrap">
              Soccer Platform
            </div> */}
          </div>
          <div className="inline-flex items-start gap-6 relative flex-[0_0_auto] ml-10">
            {navItems.map((item) => (
              <div key={item.label} className={`inline-flex flex-col items-start relative self-stretch flex-[0_0_auto]${item.active ? " pt-0 pb-1 px-0 border-b-2 [border-bottom-style:solid] border-[#ba0022]" : ""}`}>
                <div className={`relative flex items-center h-5 whitespace-nowrap text-sm tracking-[-0.35px] leading-5 mt-[-1.00px]${item.active ? " mt-[-2.00px] [font-family:'Lexend-Bold',Helvetica] font-bold text-[#ba0022]" : " [font-family:'Lexend-Regular',Helvetica] font-normal text-slate-500 cursor-pointer hover:text-[#ba0022]"}`}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MyProfile;