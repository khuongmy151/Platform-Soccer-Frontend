import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfileAPI, uploadAvatarAPI } from "../services/userService";
import { setMe } from "../stores/features/meSlice";
import { toast } from "react-toastify";

export const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const me = useSelector((state) => state.me.item);
  const [formData, setFormData] = useState({
    full_name: "",
    avatar: null,
  });
  const email = localStorage.getItem("userEmail");
  const [showPassword] = useState(false);
  const [password] = useState("············");
  const fileRef = useRef();
  const [error, setError] = useState({ errorFullName: "" });

  useEffect(() => {
    if (me !== null)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        full_name: me?.full_name || "",
        avatar: me?.avatar_url || null,
      });
  }, [me]);

  const avatarReview = useMemo(() => {
    if (formData.avatar !== null) {
      return typeof formData.avatar === "object"
        ? URL.createObjectURL(formData.avatar)
        : formData.avatar;
    }
    return "https://img.icons8.com/nolan/1200/user-default.jpg";
  }, [formData.avatar]);

  const handleAvatarClick = () => {
    fileRef.current.click();
  };

  const handleSaveChanges = async () => {
    const avatarFile = fileRef.current.files[0];
    if (avatarFile) {
      // Định nghĩa các định dạng cho phép
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];
      const MAX_SIZE = 300 * 1024; // 300KB
      // Kiểm tra định dạng
      if (!allowedTypes.includes(avatarFile.type)) {
        toast.error(
          "Ảnh đại diện không đúng định dạng. Chỉ chấp nhận JPG, JPEG, PNG, GIF."
        );
        return; // Dừng lại không cho submit
      }
      // Kiểm tra dung lượng
      if (avatarFile.size > MAX_SIZE) {
        toast.error(
          `Ảnh đại diện quá lớn (Tối đa 300KB). Hiện tại: ${(
            avatarFile.size / 1024
          ).toFixed(0)}KB`
        );
        return;
      }
    }
    const onlyAlphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const nameTrimmed = formData.full_name?.trim();
    if (!nameTrimmed) {
      setError({ errorFullName: "Họ và tên không được để trống" });
      return;
    } else if (nameTrimmed.length < 3 || nameTrimmed.length > 50) {
      setError({ errorFullName: "Họ và tên phải từ 3 đến 50 ký tự" });
      return;
    } else if (!onlyAlphaRegex.test(nameTrimmed)) {
      setError({
        errorFullName: "Họ tên không được chứa số hay ký tự đặc biệt",
      });
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Hết phiên làm việc!");
      if (fileRef.current.files[0]) {
        try {
          const response = await uploadAvatarAPI(formData.avatar, token);
          console.log("Upload thành công:", response);
        } catch (error) {
          console.error("Có lỗi xảy ra:", error);
        }
      }

      const dataToSend = {
        full_name: formData.full_name,
        phone: formData.phone || "",
      };
      const response = await updateProfileAPI(dataToSend, token);
      dispatch(setMe(response));
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu thông tin!"
      );
    }
  };

  // const handleChangePassword = async () => {
  //   if (password === "············" || password === "")
  //     return alert("Vui lòng nhập mật khẩu mới!");
  //   try {
  //     console.log("Chức năng đổi mật khẩu đang chờ Backend");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Lỗi đổi mật khẩu!");
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail"); // Xóa luôn email khi đăng xuất
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản không?"
    );
    if (!isConfirm) return;
    try {
      console.log("Chức năng xóa tài khoản đang chờ Backend");
    } catch (error) {
      console.error(error);
      alert("Lỗi xóa tài khoản!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f6fa] p-4">
      {/* Container chính: Thay vì dùng absolute cứng, dùng max-width và mx-auto */}
      <div className="flex flex-col w-full max-w-[1100px] bg-white rounded-3xl overflow-hidden shadow-[0px_32px_64px_#ba00220a] relative">
        {/* Header Background Section */}
        <div className="relative w-full h-[120px] bg-[#eff1f5]">
          <div className="absolute inset-0 opacity-10 [background:radial-gradient(50%_50%_at_26%_55%,rgba(255,0,51,1)_0%,rgba(255,0,51,0)_60%)]" />

          {/* Avatar & Name Bar: Dùng absolute để đè lên phần giao giữa header và body */}
          <div className="absolute left-8 -bottom-16 flex items-end gap-6 w-[calc(100%_-_64px)]">
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className="group relative w-32 h-32 md:w-40 md:h-40 bg-[#e0e2e8] rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${avatarReview}')`,
                  }}
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-8 h-8 text-white mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-white text-[10px] font-bold uppercase">
                    Thay đổi ảnh
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      avatar: e.target.files[0],
                    }))
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2c2f32] uppercase tracking-tighter">
                {formData.full_name || "YOUR NAME"}
              </h1>
            </div>
          </div>
        </div>

        {/* Body Section: Dùng padding thay vì absolute top để đẩy nội dung xuống */}
        <div className="pt-24 pb-12 px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-end">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="px-1 text-[#595c5f] text-[10px] font-bold tracking-widest uppercase">
                Full Name
              </label>
              <div className="border-b-2 border-[#abadb1] px-1 py-2">
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }));
                    setError({ errorFullName: "" });
                  }}
                  className="w-full bg-transparent text-[#2c2f32] text-base outline-none"
                />
              </div>
              <span className="text-brand-primary text-label-sm">
                {error.errorFullName}
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="px-1 text-[#595c5f] text-[10px] font-bold tracking-widest uppercase">
                Email Address
              </label>
              <div className="bg-[#eff1f5] border-b-2 border-transparent px-1 py-2">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-transparent text-zinc-400 text-base outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="px-1 text-[#595c5f] text-[10px] font-bold tracking-widest uppercase">
                Password
              </label>
              <div className="bg-[#eff1f5] border-b-2 border-transparent px-1 py-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="w-full bg-transparent text-zinc-400 text-base outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Change Password Button */}
            <div>
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff0033] to-[#ff6d00] text-white font-bold text-[10px] tracking-widest uppercase hover:opacity-90 transition-all">
                CHANGE PASSWORD
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-wrap items-center gap-4">
            <button
              data-umami-event="Update profile button click"
              onClick={handleSaveChanges}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#ff0033] to-[#ff6d00] text-white font-bold text-sm tracking-widest hover:opacity-90"
            >
              SAVE CHANGES
            </button>

            <button
              data-umami-event="Cancel update profile button click"
              onClick={() => navigate(-1)}
              className="px-10 py-4 rounded-xl bg-[#e0e2e8] text-[#2c2f32] font-bold text-sm tracking-widest hover:bg-gray-300"
            >
              CANCEL
            </button>

            <div className="ml-auto flex items-center gap-6">
              <button
                data-umami-event="Logout button click"
                onClick={handleLogout}
                className="text-slate-400 font-bold text-xs tracking-widest hover:text-[#BA0022] uppercase transition-colors"
              >
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-[#b02500] font-bold text-xs tracking-widest hover:opacity-70 uppercase transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
