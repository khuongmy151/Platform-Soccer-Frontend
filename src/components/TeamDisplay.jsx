export default function TeamDisplay({ name }) {
  // Lấy ký tự đầu tiên của tên đội (ví dụ: "Lions FC" -> "L")
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex items-center gap-3 w-[150px]">
      {/* Vòng tròn thay thế ảnh đội */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
        <span className="text-white font-black text-xs tracking-tighter">
          {firstLetter}
        </span>
      </div>

      {/* Tên đội bóng */}
      <span className="font-bold text-gray-800 text-[14px] truncate">
        {name}
      </span>
    </div>
  );
}
