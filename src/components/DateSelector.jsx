import { useEffect, useRef, useState, useMemo } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

export default function DateSelector({ onApply }) {
  const scrollRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [pickerDate, setPickerDate] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Tạo danh sách ngày trong năm hiện tại
  const daysInYear = useMemo(() => {
    const days = [];
    // Tạo ngày đầu năm với giờ địa phương là 00:00:00
    const dateCursor = new Date(currentYear, 0, 1, 0, 0, 0);

    while (dateCursor.getFullYear() === currentYear) {
      days.push({
        dayName: dateCursor
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        dayNumber: dateCursor.getDate().toString(),
        monthName: dateCursor
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase(),
        fullDateString: dateCursor.toDateString(),
        isoDate: dateCursor.toLocaleDateString("en-CA"), // Trả về dạng YYYY-MM-DD chuẩn Local
        isToday: dateCursor.toDateString() === new Date().toDateString(),
      });
      // Tăng thêm 1 ngày
      dateCursor.setDate(dateCursor.getDate() + 1);
    }
    return days;
  }, [currentYear]);

  // Cuộn đến một ngày cụ thể trên thanh ngang
  const scrollToDate = (dateString) => {
    if (scrollRef.current) {
      const targetElement = scrollRef.current.querySelector(
        `button[data-date="${dateString}"]`,
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  };

  // Khi selectedDate thay đổi, cuộn đến ngày đó
  useEffect(() => {
    if (selectedDate) {
      scrollToDate(selectedDate);
    }
  }, [selectedDate]);

  // Xử lý kéo thả chuột để cuộn
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Xử lý khi nhấn Apply
  const handleApply = () => {
    if (!pickerDate) return;

    // Tách chuỗi thành các số riêng biệt
    const [year, month, day] = pickerDate.split("-").map(Number);

    // Khởi tạo đúng ngày đó ở múi giờ địa phương (tháng trong JS là 0-11)
    const selected = new Date(year, month - 1, day);

    if (isNaN(selected.getTime())) return;

    onApply(pickerDate);
    setCurrentYear(selected.getFullYear());
    setSelectedDate(selected.toDateString());
  };

  const handleShowAll = () => {
    setPickerDate(""); // Reset ô input date
    setSelectedDate(null); // Bỏ highlight trên thanh cuộn ngang
    onApply(null); // Gọi callback với giá trị null để Dashboard hiển thị tất cả
  };

  return (
    <div className="w-full bg-surface-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 select-none">
      {/* Thanh cuộn ngang */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto py-1 cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? "scale-[0.99]" : ""
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {daysInYear.map((item) => {
          const isActive = selectedDate === item.fullDateString;
          return (
            <button
              key={item.fullDateString}
              data-date={item.fullDateString}
              onClick={() => {
                setPickerDate(item.isoDate);
                setSelectedDate(item.fullDateString);
                // Gọi callback lọc tournament ra ngoài (Dashboard)
                onApply(item.isoDate);
              }}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-22 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(150deg,#d31027_0%,#ff9482_100%)] text-white shadow-md scale-105 z-10 is-today"
                  : "bg-surface-card text-gray-400 hover:bg-gray-100"
              }`}
            >
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${
                  isActive ? "text-white/90" : "text-gray-500"
                }`}
              >
                {item.monthName}
              </span>
              <span className="text-xl font-black font-display leading-none mb-1">
                {item.dayNumber}
              </span>
              <span
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  isActive ? "bg-white/20 text-white" : "text-gray-500/60"
                }`}
              >
                {item.dayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Date Picker + Apply + Show All */}
      <div className="flex flex-col items-start gap-2 w-full lg:w-auto">
        <label className="text-[9px] font-black text-brand-primary uppercase tracking-widest lg:mr-2">
          Select Date
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={pickerDate}
            onChange={(e) => setPickerDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-surface-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />

          <button
            onClick={handleApply}
            className="bg-brand-primary hover:bg-brand-dark text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-widest shadow-sm"
          >
            Apply
          </button>

          <button
            onClick={handleShowAll}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold px-3 py-2 rounded-lg transition-colors uppercase tracking-widest border border-gray-200"
          >
            <HiOutlineRefresh size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
